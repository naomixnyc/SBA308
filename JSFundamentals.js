// SBA 308: JavaScript Fundamentals

// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];



function getLearnerData(course, ag, submissions) {



    let points_dueTable = AssignmentGroup.assignments.reduce((acc, assignment) => {
        acc[assignment.id] = { 'points_possible': assignment.points_possible, due_date: new Date(assignment.due_at) }
        return acc
    }, {})
    //console.log(points_dueTable)
    // {
    //     '1': { points_possible: 50, due_date: 2023-01 - 25T00:00:00.000Z },
    //     '2': { points_possible: 150, due_date: 2023-02 - 27T00:00:00.000Z },
    //     '3': { points_possible: 500, due_date: 3156 - 11 - 15T00:00:00.000Z }
    // }



    const studentData = {}
    LearnerSubmissions.forEach(sub => {

        if (!studentData[sub.learner_id]) {
            studentData[sub.learner_id] = { id: sub.learner_id, avg: 0, assignment_scores: {} }
        }

        studentData[sub.learner_id].assignment_scores[sub.assignment_id] = sub.submission.score

        //console.log(`before deduction: sudent id ${sub.learner_id}, assignment id ${sub.assignment_id}, score ${sub.submission.score}`)
        //checks if submission was late
        if (new Date(sub.submission.submitted_at) > new Date(points_dueTable[sub.assignment_id].due_date)) {
            studentData[sub.learner_id].assignment_scores[sub.assignment_id] = sub.submission.score - points_dueTable[sub.assignment_id].points_possible * 0.10 // deduct 10% of points possible
            //make sure score is a number
        }
        //console.log(`after deduction: sudent id ${sub.learner_id}, assignment id ${sub.assignment_id}, score ${sub.submission.score}`)

    })
    // console.log("studentData: ", studentData)
    // studentData:  {
    //     '125': {
    //       id: 125,
    //       avg: 0,
    //       assignment_scores: { '1': 47, '2': 150, '3': 400 }
    //     },
    //     '132': { id: 132, avg: 0, assignment_scores: { '1': 39, '2': 125 } }
    //   }


    // -- Just an AVERAFGE working --> weighted average --
    // for (const key in studentData) {
    //     studentData[key].avg = Object.values(studentData[key].assignment_scores)
    //         .reduce((acc, score) => acc + score, 0) / Object.values(studentData[key].assignment_scores).length
    // }
    // console.log("studentData: ", studentData)
    // studentData: {
    //     '125': {
    //         id: 125,
    //             avg: 199,
    //                 assignment_scores: { '1': 47, '2': 150, '3': 400 }
    //     },
    //     '132': { id: 132, avg: 82, assignment_scores: { '1': 39, '2': 125 } }
    // }


    // //making it weighted average for each student
    for (key in studentData) {
        let totalPointsPossible = Object.entries(studentData[key].assignment_scores)
            .reduce((acc, [assignmentId]) => acc + points_dueTable[assignmentId].points_possible, 0)

        //console.log(`Total points possible for student ${key}:`, totalPointsPossible)

        studentData[key].avg = Object.values(studentData[key].assignment_scores)
            .reduce((acc, score) => acc + score, 0) / totalPointsPossible
    }

    //console.log("studentData: ", studentData)
    // studentData:  {
    //     '125': {
    //       id: 125,
    //       avg: 0.8528571428571429,
    //       assignment_scores: { '1': 47, '2': 150, '3': 400 }
    //     },
    //     '132': { id: 132, avg: 0.82, assignment_scores: { '1': 39, '2': 125 } }
    //   }

    const result = []

    for (const key in studentData) {
        const newStudent = {
            id: studentData[key].id,
            avg: studentData[key].avg.toFixed(2),
            ...studentData[key].assignment_scores  // spread 
        }
        result.push(newStudent)
    }
    return result

}

console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions))
