let students = []
const API_URL = 'https://665aad03003609eda45e7c6a.mockapi.io/service' // API manzilini o'zgartiring

// Ma'lumotlarni API dan olish
async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/academy`)
        const data = await response.json()
        students = data
        updateTable()
    } catch (error) {
        showNotification('Ma\'lumotlarni yuklashda xatolik!', 'error')
    }
}

// Yangi student qo'shish
async function addStudent() {
    const name = document.getElementById('studentName').value
    const score = parseInt(document.getElementById('studentScore').value)

    if (name && score) {
        if (score > 100) {
            showNotification('Ball 100 dan oshmasligi kerak!', 'error')
            return
        }

        try {
            const response = await fetch(`${API_URL}/academy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    ball: score.toString()
                })
            })

            if (!response.ok) throw new Error('Xatolik yuz berdi')

            await loadStudents() // Yangi ma'lumotlarni yuklash

            document.getElementById('studentName').value = ''
            document.getElementById('studentScore').value = ''
            showNotification('Student qo\'shildi!')
        } catch (error) {
            showNotification('Xatolik yuz berdi!', 'error')
        }
    } else {
        showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error')
    }
}

// Ballni yangilash
async function updateScore(id, currentScore) {
    const newScore = prompt(`Yangi ballni kiriting (0-100):`, currentScore)
    if (newScore !== null) {
        const score = parseInt(newScore)
        if (isNaN(score) || score < 0 || score > 100) {
            showNotification('Noto\'g\'ri ball kiritildi!', 'error')
            return
        }

        try {
            const response = await fetch(`${API_URL}/academy/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ball: score.toString()
                })
            })

            if (!response.ok) throw new Error('Xatolik yuz berdi')

            await loadStudents() // Yangi ma'lumotlarni yuklash
            showNotification('Ball yangilandi!')
        } catch (error) {
            showNotification('Xatolik yuz berdi!', 'error')
        }
    }
}

// Studentni o'chirish
async function deleteStudent(id) {
    if (confirm('Rostdan ham bu studentni o\'chirmoqchimisiz?')) {
        try {
            const response = await fetch(`${API_URL}/academy/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Xatolik yuz berdi')

            await loadStudents() // Yangi ma'lumotlarni yuklash
            showNotification('Student o\'chirildi')
        } catch (error) {
            showNotification('Xatolik yuz berdi!', 'error')
        }
    }
}

function updateTable() {
    const tableBody = document.getElementById('studentsList')
    tableBody.innerHTML = ''

    // Ballar bo'yicha tartiblash
    students.sort((a, b) => parseInt(b.ball) - parseInt(a.ball))

    students.forEach((student, index) => {
        const row = document.createElement('tr')
        const position = index + 1
        let medal = ''

        if (position === 1) medal = '🥇'
        else if (position === 2) medal = '🥈'
        else if (position === 3) medal = '🥉'

        row.innerHTML = `
            <td class="position-cell">${position} ${medal}</td>
            <td class="name-cell">${student.name}</td>
            <td class="score-cell">
                <div class="score-bar">
                    <div class="score-fill" style="width: ${student.ball}%">
                        ${student.ball}
                    </div>
                </div>
            </td>
            <td class="actions-cell">
                <button class="action-btn edit-btn" onclick="updateScore(${student.id}, ${student.ball})" title="Ballni tahrirlash">
                    ✏️
                </button>
                <button class="action-btn delete-btn" onclick="deleteStudent(${student.id})" title="O'chirish">
                    🗑️
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

// Sahifa yuklanganda ma'lumotlarni yuklash
loadStudents()
