module.exports = async function(db, {proffyValue, classValue, classScheduleValues}) {
    // o que está acontecendo é uma promessa:
    /** "eu prometo que vou tentar rodar o que você tá me pedindo (run),
     * se rodar, então (then) eu faço esta outra coisa"
     */

    /** Existem duas formas:
     *     db.run().then()
     *     a palavra chave "await" (faz com que a aplicação espere aquela linha terminar a execução)
     */

    // inserir dados na table de proffys
    const insertedProffy = await db.run(`
        INSERT INTO proffys (
            name,
            avatar,
            whatsapp,
            bio
        ) VALUES (
            "${proffyValue.name}",
            "${proffyValue.avatar}",
            "${proffyValue.whatsapp}",
            "${proffyValue.bio}"
        );
    `)
    const proffy_id = insertedProffy.lastID

    // inserir dados na table de classes
    const insertedClass = await db.run(`
        INSERT INTO classes (
            subject,
            cost,
            proffy_id
        ) VALUES (
            "${classValue.subject}",
            "${classValue.cost}",
            "${proffy_id}"
        );
    `)
    const class_id = insertedClass.lastID

    // inserir dados na table de class_schedule
    const insertedAllClassScheduleValues = classScheduleValues.map((classScheduleValue) => {
        return db.run(`
            INSERT INTO class_schedule (
                class_id,
                weekday,
                time_from,
                time_to
            ) VALUES (
                "${class_id}",
                "${classScheduleValue.weekday}",
                "${classScheduleValue.time_from}",
                "${classScheduleValue.time_to}"
            );
        `)
    })

    // Aqui irei executar todos os db.runs() das class_schedules
    await Promise.all(insertedAllClassScheduleValues)
}