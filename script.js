/**
 * aiCaseManage - 核心逻辑
 * 包含数据存储、页面路由、业务核验
 */

// 模拟数据库结构与初始数据
const INITIAL_DATA = {
    patients: [],
    tasks: [],
    logs: []
};

// 预设操作员权限表 (模拟后端鉴权配置)
const OPERATORS = {
    'DOC_01': { name: '张医生', role: 'DOCTOR', allowedLoc: 'DOC_OFFICE', pin: '1234' },
    'IMG_01': { name: '李技师', role: 'IMAGING', allowedLoc: 'IMG_CENTER', pin: '1234' },
    'PHY_01': { name: '王治疗师', role: 'THERAPIST', allowedLoc: 'PHYSIO_ROOM', pin: '1234' }
};

// 任务类型与所需地点映射
const TASK_CONFIG = {
    'PRESCRIPTION': { label: '💊 处方开具', requiredLoc: 'DOC_OFFICE' },
    'IMAGING': { label: '🩻 影像检查', requiredLoc: 'IMG_CENTER' },
    'THERAPY': { label: '💆 物理治疗', requiredLoc: 'PHYSIO_ROOM' }
};

class App {
    constructor() {
        this.data = this.loadData();
        this.init();
    }

    // --- 数据层 ---
    loadData() {
        const stored = localStorage.getItem('aiCaseManage_db');
        if (!stored) {
            // 初始化一些演示数据
            const demoData = JSON.parse(JSON.stringify(INITIAL_DATA));
            return demoData;
        }
        return JSON.parse(stored);
    }

    saveData() {
        localStorage.setItem('aiCaseManage_db', JSON.stringify(this.data));
        this.renderDashboard(); // 数据变动刷新仪表盘
    }

    logActivity(msg) {
        const log = { time: new Date().toLocaleString(), msg };
        this.data.logs.unshift(log);
        this.saveData();
    }
    // --- 系统管理 ---
    resetSystem() {
        if (confirm('⚠️ 确定要清空所有数据吗？此操作不可恢复！')) {
            localStorage.removeItem('aiCaseManage_db');
            location.reload(); // 刷新页面
        }
    }

    // --- 视图层 ---
    init() {
        this.renderDashboard();
        this.renderPatientList();
        this.renderTaskList();
        
        // 绑定全局点击事件处理模态框关闭等
        window.onclick = (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('open');
            }
        };
    }

    navigate(viewId) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.sidebar nav button').forEach(el => el.classList.remove('active'));
        
        document.getElementById(`view-${viewId}`).classList.add('active');
        event.currentTarget.classList.add('active');
        
        // 刷新对应视图数据
        if (viewId === 'patients') this.renderPatientList();
        if (viewId === 'tasks') this.renderTaskList();
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.add('open');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('open');
    }

    // --- 业务逻辑：患者管理 ---
    handleAddPatient(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        // 生成随机6位就诊码 (模拟核验凭证)
        const visitCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const newPatient = {
            id: Date.now().toString(),
            name: formData.get('name'),
            age: formData.get('age'),
            visitCode: visitCode,
            status: '待诊'
        };

        this.data.patients.push(newPatient);
        
        // 自动生成初始任务 (模拟医生开单)
        this.createTask(newPatient.id, 'PRESCRIPTION', '待医生开具处方');
        
        this.saveData();
        this.closeModal('modal-add-patient');
        this.renderPatientList();
        this.logActivity(`新患者登记: ${newPatient.name} (码:${visitCode})`);
        e.target.reset();
    }

    createTask(patientId, type, desc) {
        const task = {
            id: 'T' + Date.now() + Math.floor(Math.random()*100),
            patientId,
            type,
            desc,
            status: 'PENDING',
            result: null,
            completedBy: null,
            completedAt: null
        };
        this.data.tasks.push(task);
        this.saveData();
    }

    // --- 业务逻辑：任务核验与执行 (核心考核点) ---
    
    // 打开核验窗口
    openVerifyModal(taskId) {
        const task = this.data.tasks.find(t => t.id === taskId);
        const patient = this.data.patients.find(p => p.id === task.patientId);
        
        document.getElementById('verify-task-id').value = taskId;
        document.getElementById('verify-task-desc').innerHTML = `
            <strong>${TASK_CONFIG[task.type].label}</strong><br>
            患者: ${patient.name}<br>
            <span style="color:red; font-size:12px;">需前往: ${TASK_CONFIG[task.type].requiredLoc}</span>
        `;
        this.openModal('modal-verify');
    }

    // 提交核验
    handleTaskExecution(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const taskId = formData.get('verify-task-id'); // 隐藏域获取
        const resultText = formData.get('result');
        const inputLocation = formData.get('location');
        const inputVisitCode = formData.get('visitCode');
        const operatorId = formData.get('operatorId');
        const inputPin = formData.get('pin');

        const task = this.data.tasks.find(t => t.id === taskId);
        const patient = this.data.patients.find(p => p.id === task.patientId);
        const operator = OPERATORS[operatorId];

        // --- 核心核验算法 ---
        const errors = [];

        // 1. 校验 PIN 码
        if (operator.pin !== inputPin) {
            errors.push("❌ 操作员 PIN 码错误！");
        }

        // 2. 校验患者就诊码 (证明患者在场)
        if (inputVisitCode !== patient.visitCode) {
            errors.push("❌ 患者就诊码不匹配！请核对患者身份。");
        }

        // 3. 校验地点与权限 (Location & Role Check)
        // 规则：当前地点必须匹配任务要求，且操作员必须有权在该地点操作
        const requiredLoc = TASK_CONFIG[task.type].requiredLoc;
        
        if (inputLocation !== requiredLoc) {
            errors.push(`❌ 地点错误！此业务必须在 [${requiredLoc}] 进行，当前在 [${inputLocation}]`);
        }
        
        if (operator.allowedLoc !== requiredLoc) {
            errors.push(`❌ 权限不足！操作员 [${operator.name}] 无权在 [${requiredLoc}] 执行任务。`);
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        // --- 核验通过，执行业务 ---
        task.status = 'COMPLETED';
         if (task.type === 'PRESCRIPTION') {
            // 处方开完了，进入诊疗中
            patient.status = '诊疗中';
        } else if (task.type === 'IMAGING' || task.type === 'THERAPY') {
            // 检查或理疗做完了，流程结束
            patient.status = '诊疗结束';
        }
        task.result = resultText;
        task.completedBy = operator.name;
        task.completedAt = new Date().toLocaleString();

        // 业务流转逻辑：如果是处方完成，自动触发后续任务
        if (task.type === 'PRESCRIPTION') {
            // 简单模拟：开完处方后，随机生成影像或理疗任务
            if (Math.random() > 0.5) {
                this.createTask(patient.id, 'IMAGING', '医嘱：胸部CT检查');
                alert('✅ 处方已开具，系统自动派发：影像检查任务');
            } else {
                this.createTask(patient.id, 'THERAPY', '医嘱：肩颈康复理疗');
                alert('✅ 处方已开具，系统自动派发：理疗任务');
            }
        } else {
            alert('✅ 诊疗项目已完成并归档！');
        }

        this.saveData();
        this.closeModal('modal-verify');
        this.renderTaskList();
        this.logActivity(`任务完成: ${TASK_CONFIG[task.type].label} - ${patient.name}`);
        e.target.reset();
    }

    // --- 渲染逻辑 ---
    renderDashboard() {
        document.getElementById('stat-total-patients').innerText = this.data.patients.length;
        document.getElementById('stat-pending-tasks').innerText = this.data.tasks.filter(t => t.status === 'PENDING').length;
        document.getElementById('stat-completed-tasks').innerText = this.data.tasks.filter(t => t.status === 'COMPLETED').length;

        const logList = document.getElementById('activity-log');
        logList.innerHTML = this.data.logs.slice(0, 5).map(log => `
            <li>
                <span>${log.msg}</span>
                <span class="log-time">${log.time.split(' ')[1]}</span>
            </li>
        `).join('');
    }

       renderPatientList() {
        const tbody = document.getElementById('patient-list-body');
        tbody.innerHTML = this.data.patients.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td><code style="background:#eee;padding:2px 4px;border-radius:4px;">${p.visitCode}</code></td>
                <td>
                    <span class="status-badge status-${getStatusClass(p.status)}">
                        ${p.status}
                    </span>
                </td>
                <td>
                    <!-- 详情按钮 -->
                    <button class="btn-sm" onclick="app.viewPatientHistory('${p.id}')">详情</button>
                    <!-- 编辑按钮 (新增) -->
                    <button class="btn-sm btn-secondary" onclick="app.openEditPatient('${p.id}')">编辑</button>
                    <!-- 删除按钮 (新增) -->
                    <button class="btn-sm btn-danger" onclick="app.deletePatient('${p.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    }


    filterTasks(type) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        this.renderTaskList(type);
    }

    renderTaskList(filterType = 'ALL') {
        const container = document.getElementById('task-list-container');
        let tasks = this.data.tasks;
        
        if (filterType !== 'ALL') {
            tasks = tasks.filter(t => t.type === filterType);
        }

        // 按时间倒序
        tasks.sort((a, b) => b.id.localeCompare(a.id));

        container.innerHTML = tasks.map(t => {
            const patient = this.data.patients.find(p => p.id === t.patientId) || {name: 'Unknown'};
            const config = TASK_CONFIG[t.type];
            const isDone = t.status === 'COMPLETED';

            return `
            <div class="task-card" style="border-left: 4px solid ${isDone ? '#10b981' : '#f59e0b'}">
                <div class="task-header">
                    <span style="font-weight:bold">${config.label}</span>
                    <span class="badge ${isDone ? 'badge-completed' : 'badge-pending'}">
                        ${isDone ? '已完成' : '待处理'}
                    </span>
                </div>
                <p style="font-size:14px; color:#666; margin-bottom:8px;">患者: <strong>${patient.name}</strong></p>
                <p style="font-size:13px; margin-bottom:12px;">${t.desc}</p>
                
                ${isDone ? `
                    <div style="background:#f9fafb; padding:8px; font-size:12px; border-radius:4px;">
                        <p><strong>结果:</strong> ${t.result}</p>
                        <p style="color:#999; margin-top:4px;">执行人: ${t.completedBy} @ ${t.completedAt}</p>
                    </div>
                ` : `
                    <div class="task-actions">
                        <button class="btn-primary btn-sm" onclick="app.openVerifyModal('${t.id}')">
                            ⚡ 执行并核验
                        </button>
                    </div>
                `}
            </div>
            `;
        }).join('');
        
        if (tasks.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center; grid-column:1/-1;">暂无相关任务</p>';
        }
    }
        // --- 新增业务逻辑：查看患者病历详情 ---
    viewPatientHistory(patientId) {
        const patient = this.data.patients.find(p => p.id === patientId);
        if (!patient) return;

        // 1. 填充头部基础信息
        document.getElementById('history-p-name').innerText = patient.name;
        document.getElementById('history-p-code').innerText = patient.visitCode;
        document.getElementById('history-p-status').innerText = patient.status;

        // 2. 筛选并排序该患者的任务
        const tasks = this.data.tasks.filter(t => t.patientId === patientId);
        // 按 ID (时间) 正序排列，模拟就诊顺序
        tasks.sort((a, b) => a.id.localeCompare(b.id));

        // 3. 生成时间轴 HTML
        const timelineContainer = document.getElementById('history-timeline-list');
        
        if (tasks.length === 0) {
            timelineContainer.innerHTML = '<li style="color:#999">暂无诊疗记录</li>';
        } else {
            timelineContainer.innerHTML = tasks.map(t => {
                const isDone = t.status === 'COMPLETED';
                const config = TASK_CONFIG[t.type];
                
                return `
                <li class="timeline-item ${isDone ? 'done' : ''}">
                    <div class="timeline-content">
                        <span class="timeline-time">
                            ${isDone ? t.completedAt : '待处理...'}
                        </span>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong>${config.label}</strong>
                            <span class="badge ${isDone ? 'badge-completed' : 'badge-pending'}">
                                ${isDone ? '已完成' : '进行中'}
                            </span>
                        </div>
                        <p style="margin-top:8px; font-size:13px; color:#555;">
                            ${isDone ? `🏁 结果: ${t.result}<br><small>执行人: ${t.completedBy}</small>` : `📝 说明: ${t.desc}`}
                        </p>
                    </div>
                </li>
                `;
            }).join('');
        }

        this.openModal('modal-patient-history');
    }
        // --- 新增 CRUD：删除患者 ---
    deletePatient(id) {
        if (!confirm('⚠️ 警告：删除患者将同步清空其所有诊疗记录！确定要删除吗？')) {
            return;
        }

        // 1. 删除患者
        this.data.patients = this.data.patients.filter(p => p.id !== id);
        
        // 2. 级联删除：把该患者关联的任务也删掉，防止产生垃圾数据
        this.data.tasks = this.data.tasks.filter(t => t.patientId !== id);

        this.saveData();
        this.renderPatientList();
        this.renderDashboard(); // 更新仪表盘数字
        this.logActivity(`管理员删除了患者 (ID: ${id})`);
    }

    // --- 新增 CRUD：打开编辑窗口 ---
    openEditPatient(id) {
        const patient = this.data.patients.find(p => p.id === id);
        if (!patient) return;

        // 回显数据到表单
        document.getElementById('edit-p-id').value = patient.id;
        document.getElementById('edit-p-name').value = patient.name;
        document.getElementById('edit-p-age').value = patient.age;
        document.getElementById('edit-p-code').value = patient.visitCode;

        this.openModal('modal-edit-patient');
    }

    // --- 新增 CRUD：保存编辑 ---
    handleEditPatient(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const id = formData.get('id');
        
        // 找到该患者
        const patient = this.data.patients.find(p => p.id === id);
        if (patient) {
            patient.name = formData.get('name');
            patient.age = formData.get('age');
            
            this.saveData();
            this.closeModal('modal-edit-patient');
            this.renderPatientList();
            this.logActivity(`更新了患者信息: ${patient.name}`);
        }
    }


}

// 启动应用
const app = new App(
    
);
// 辅助函数：根据中文状态返回对应的 CSS 类名后缀
function getStatusClass(status) {
    if (status === '待诊') return 'waiting';
    if (status === '诊疗中') return 'active';
    if (status === '诊疗结束') return 'done';
    return 'default';
}

