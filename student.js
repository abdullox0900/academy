let students = []
const API_URL = 'https://665aad03003609eda45e7c6a.mockapi.io/service' // API manzilini o'zgartiring

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/academy`)
        const data = await response.json()
        students = data
        updateTable()
    } catch (error) {
        console.error('Ma\'lumotlarni yuklashda xatolik:', error)
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
        `
        tableBody.appendChild(row)
    })
}

// Har 5 sekundda yangilanadi
setInterval(loadStudents, 5000)

// Dastlabki yuklash
loadStudents() 