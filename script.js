// LocalStorage dan ma'lumotlarni olish
let students = JSON.parse(localStorage.getItem('students')) || [
    { name: "Ali Valiyev", score: 95 },
    { name: "Malika Karimova", score: 190 },
    { name: "Jamshid Toshmatov", score: 87 },
    { name: "Nilufar Azizova", score: 92 }
]

function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students))
}

function addStudent() {
    const name = document.getElementById('studentName').value
    const score = parseInt(document.getElementById('studentScore').value)

    if (name && score) {
        if (score > 100) {
            alert('Ball 100 dan oshmasligi kerak!')
            return
        }

        students.push({ name, score })
        students.sort((a, b) => b.score - a.score)
        saveToLocalStorage()
        updateTable()

        document.getElementById('studentName').value = ''
        document.getElementById('studentScore').value = ''

        showNotification('Student muvaffaqiyatli qo\'shildi!')
    } else {
        showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error')
    }
}

function deleteStudent(index) {
    if (confirm('Rostdan ham bu studentni o\'chirmoqchimisiz?')) {
        students.splice(index, 1)
        saveToLocalStorage()
        updateTable()
        showNotification('Student o\'chirildi')
    }
}

function updateTable() {
    const tableBody = document.getElementById('studentsList')
    tableBody.innerHTML = ''

    students.forEach((student, index) => {
        const row = document.createElement('tr')
        const position = index + 1
        let medal = ''

        if (position === 1) medal = '🥇'
        else if (position === 2) medal = '🥈'
        else if (position === 3) medal = '🥉'

        row.innerHTML = `
            <td>${position} ${medal}</td>
            <td>${student.name}</td>
            <td>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${student.score}%">
                        ${student.score}
                    </div>
                </div>
            </td>
            <td>
                <button class="delete-btn" onclick="deleteStudent(${index})">
                    <span class="delete-icon">🗑️</span>
                </button>
            </td>
        `
        tableBody.appendChild(row)
    })
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
        notification.classList.add('show')
        setTimeout(() => {
            notification.classList.remove('show')
            setTimeout(() => {
                notification.remove()
            }, 300)
        }, 2000)
    }, 100)
}

// Dastlabki ma'lumotlarni ko'rsatish
students.sort((a, b) => b.score - a.score)
updateTable() 