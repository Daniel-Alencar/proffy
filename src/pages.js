const Database = require("./database/db")

const {
    subjects,
    weekdays,
    getSubject,
    convertHoursToMinutes

} = require("./utils/format")

// Funcionalidades
function pageLanding(req, res) {
    return res.render("index.html")
}

async function pageStudy(req, res) {

    // pegar os valores do formulário enviado através do front-end
    const filters = req.query
    
    // retornar os valores que queremos que apareçam no front-end
    if(!filters.subject || !filters.weekday || !filters.time) {
        return res.render("study.html", { filters: filters, weekdays: weekdays, subjects: subjects })
    }
    // se não tiver campos vazios
    console.log('Não tem campos vazios')

    // converter horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = '${filters.subject}'
    `

    // caso haja erro na consulta do banco de dados
    try {
        const db = await Database
        const proffys = await db.all(query)

        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render('study.html', { proffys, subjects, filters, weekdays })

    } catch (error) {
        console.log(error)
    }
}

function pageGiveClasses(req, res) {
    return res.render("give-classes.html", { subjects: subjects, weekdays: weekdays})
}

async function saveClasses(req, res) {
    const createProffy = require('./database/createProffy')

    // pegar os valores do formulário enviado através do front-end
    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }
    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }

    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday: weekday,
            time_from: convertHoursToMinutes(req.body.time_from[index]),
            time_to: convertHoursToMinutes(req.body.time_to[index])
        }
    })

    try {
        const db = await Database
        await createProffy(db, { proffyValue, classValue, classScheduleValues })

        let queryString = "?subject=" +req.body.subject
        queryString += "&weekday=" + req.body.weekday[0]
        queryString += "&time=" + req.body.time_from[0]

        return res.redirect("/study" + queryString)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
}