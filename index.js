import cron from 'node-cron'
import {faker, de} from '@faker-js/faker'
import axios from 'axios'
import config from './config.js'
import dotenv from 'dotenv'

dotenv.config()

console.log(process.env.TOKEN);

if (config.createUser) {
    cron.schedule('*/1 * * * * *', async () => {
        var person = faker.person;
        var createUser = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_user_create_users',
            'users':[
                {
                    'username':faker.internet.userName().toLowerCase(),
                    'firstname':person.firstName(),
                    'lastname':person.lastName(),
                    'email':faker.internet.email(),
                    'password':'2352169As!'
                }
            ]
        }})
        console.log("Create user: ",createUser.data);
    });
}

if (config.updatedUser) {
        var person = faker.person;
        axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
            params:{
                'moodlewsrestformat':'json',
                'wstoken':process.env.TOKEN,
                'wsfunction':'core_user_get_users',
                'criteria':[{
                    "key":"firstname",
                    "value":"%"
                }]
            }
        }).then(async (res)=>{
            var users = res.data.users;
            for (let index = 0; index < users.length; index++) {
                const element = users[index];
                var user = new Object()
                console.log(element.id)
                user.id = element.id;
                user.username = faker.internet.userName().toLowerCase();
                user.firstname = person.firstName();
                user.lastname = person.lastName();
                user.email = faker.internet.email();
                user.suspended = 0;
                
                var updateUser = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
                    params:{
                        'moodlewsrestformat':'json',
                        'wstoken':process.env.TOKEN,
                        'wsfunction':'core_user_update_users',
                        'users':[user]
                    }
                })
                console.log(updateUser.data);
            }
        })
}

if(config.deletedUser){
    var person = faker.person;
    axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_user_get_users',
            'criteria':[{
                "key":"firstname",
                "value":"%"
            }]
        }
    }).then(async (res)=>{
        var users = res.data.users;
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            
            var deletedUser = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
                params:{
                    'moodlewsrestformat':'json',
                    'wstoken':process.env.TOKEN,
                    'wsfunction':'core_user_delete_users',
                    'userids':[element.id]
                }
            })
            console.log(deletedUser.data);
        }
    })
}

if (config.createCourse) {
    cron.schedule('*/1 * * * * *', async () => {
        var course = faker.company.name().toLowerCase();
        var createCourse = await axios(
            "http://10.8.0.11//moodle/webservice/rest/server.php",
            {
                params:{
                    'moodlewsrestformat':'json',
                    'wstoken':process.env.TOKEN,
                    'wsfunction':'core_course_create_courses',
                    'courses':[
                        {
                            'fullname':course,
                            'shortname':course,
                            'categoryid':1
                        }
                    ]
                }
            }
        )
        console.log("Create course: ",createCourse.data);
    })
}

if(config.deleteCourse){
    var course = 7122;
    var courses = [428]
    cron.schedule('*/1 * * * * *', async () => {
        var deleteCourse = await axios(
            "http://10.8.0.11/moodle/webservice/rest/server.php",
            {
                params:{
                    'moodlewsrestformat':'json',
                    'wstoken':process.env.TOKEN,
                    'wsfunction':'core_course_delete_courses',
                    'courseids':[course]
                }
            }
        )
        course = course + 1
        console.log("Delete course: ",deleteCourse.data);
    })
}

if (config.courseUpdated) {
    cron.schedule('*/1 * * * * *', async () => {
        var course = faker.company.name().toLowerCase();
        var courseUpdated = await axios(
            "http://10.8.0.11//moodle/webservice/rest/server.php",
            {
                params:{
                    'moodlewsrestformat':'json',
                    'wstoken':process.env.TOKEN,
                    'wsfunction':'core_course_update_courses',
                    'courses':[
                        {
                            'id':1229,
                            'fullname':course,
                            'shortname':course,
                            'categoryid':1
                        }
                    ]
                }
            }
        )
        console.log("Course update: ",courseUpdated.data);
    })
}

if(config.userEnrolmentCreated){
    var getallpersons = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",
    {
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_user_get_users',
            'criteria':[
                {
                    'key':'email',
                    'value':'%%'
                }
            ]
        }
    })
    var getallcourses = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_course_get_courses'
        }
    })
    //un metodo burbuja para meter a todos los estudiantes a todos los cursos recordar ignorar
    //el estudiante 1,2 y el curso 1 que son los que vienen por defecto en moodle
    for(var i = 0; i < getallpersons.data.users.length; i++){
        var user = getallpersons.data.users[i];
        if(user.id != 1 || user.id != 2){
            for (var j = 0; j < getallcourses.data.length; j++) {
                const course = getallcourses.data[j];
                if(course.id != 1){
                    var enrol = await axios('http://10.8.0.11/moodle/webservice/rest/server.php',{
                        params: {
                            'moodlewsrestformat':'json',
                            'wstoken':process.env.TOKEN,
                            'wsfunction':'enrol_manual_enrol_users',
                            'enrolments':[
                                {
                                    "roleid":"5",
                                    "userid":user.id,
                                    "courseid":course.id
                                }
                            ]
                        }
                    })
                    console.log(enrol.data);
                }
            }
        }
    }
}

if (config.userEnrolmentDeleted) {
    var getallcourses = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_course_get_courses'
        }
    })

    for (var j = 0; j < getallcourses.data.length; j++) {
        const course = getallcourses.data[j];
        var enrollemntByCourse = await axios('http://10.8.0.11/moodle/webservice/rest/server.php',{
            params:{
                'moodlewsrestformat':'json',
                'wstoken':process.env.TOKEN,
                'wsfunction':'core_enrol_get_enrolled_users',
                'courseid':course.id
            }
        })
        for (let index = 0; index < enrollemntByCourse.data.length; index++) {
            const element = enrollemntByCourse.data[index];
            if(element.id != 1 || element.id != 2){
                if(element.hasOwnProperty('enrolledcourses')){
                    for (let indexEnrollment = 0; indexEnrollment < element.enrolledcourses.length; indexEnrollment++) {
                        const enrollElement = element.enrolledcourses[indexEnrollment];
                        const unenrollment = await axios('http://10.8.0.11/moodle/webservice/rest/server.php',{
                            params:{
                                'moodlewsrestformat':'json',
                                'wstoken':process.env.TOKEN,
                                'wsfunction':'enrol_manual_unenrol_users',
                                'enrolments':[
                                    {
                                        'userid':element.id,
                                        'courseid':enrollElement.id,
                                        'roleid':5
                                    }
                                ]
                            }
                        })
                        console.log(unenrollment.data);
                    }
                }
            }
        }
    }
}

if(config.messageSent){
    var getallpersons = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",
    {
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_user_get_users',
            'criteria':[
                {
                    'key':'email',
                    'value':'%%'
                }
            ]
        }
    })

    var listOne = getallpersons.data.users
    var listTwo = getallpersons.data.users
    for (let indexListOne = 0; indexListOne < listOne.length; indexListOne++) {
        const elementListOne = listOne[indexListOne];
        var message = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
            params:{
                'moodlewsrestformat':'json',
                'wstoken':process.env.TOKEN,
                'wsfunction':'core_message_send_instant_messages',
                'messages':[
                    {
                        'touserid':elementListOne.id,
                        'text':faker.word.adjective(),
                        'textformat':0,
                        'clientmsgid':1
                    }
                ]
            }
        })
        console.log(message.data);
    }
}

if(config.messageViewed){

    var getallpersons = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",
    {
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_user_get_users',
            'criteria':[
                {
                    'key':'email',
                    'value':'%%'
                }
            ]
        }
    })

    for (let index = 0; index < getallpersons.data.users.length; index++) {
        const element = getallpersons.data.users[index];
        
        var conversations = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
            params:{
                'moodlewsrestformat':'json',
                'wstoken':process.env.TOKEN,
                'wsfunction':'core_message_get_conversations',
                'userid':element.id
            }
        })

        for (let j = 0; j < conversations.data.conversations.length; j++) {
            const elementcconversation = conversations.data.conversations[j];

            var markAsRead = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
                params:{
                    'moodlewsrestformat':'json',
                    'wstoken':process.env.TOKEN,
                    'wsfunction':'core_message_mark_all_conversation_messages_as_read',
                    'userid':element.id,
                    'conversationid':elementcconversation.id
                }
            })

            console.log(markAsRead.data);
        }
    }
}

if(config.messageDeleted){
    var getallpersons = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",
    {
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_user_get_users',
            'criteria':[
                {
                    'key':'email',
                    'value':'%%'
                }
            ]
        }
    })
    for (let index = 0; index < getallpersons.data.users.length; index++) {
        const element = getallpersons.data.users[index];
        
        var conversations = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
            params:{
                'moodlewsrestformat':'json',
                'wstoken':process.env.TOKEN,
                'wsfunction':'core_message_get_conversations',
                'userid':element.id
            }
        })

        for (let j = 0; j < conversations.data.conversations.length; j++) {
            const elementcconversation = conversations.data.conversations[j];
            const elementmessages = elementcconversation.messages
            if (elementmessages.length > 0) {
                for (let w = 0; w < elementmessages.length; w++) {
                    const elementmessage = elementmessages[w];
                    var deletemessage = await axios('http://10.8.0.11/moodle/webservice/rest/server.php',{
                        params:{
                            'moodlewsrestformat':'json',
                            'wstoken':process.env.TOKEN,
                            'wsfunction':'core_message_delete_message',
                            'messageid ':elementmessage.id,
                            'userid': element.id
                        }
                    })
                    console.log(deletemessage.data);
                }
            } 
        }
    }
}

if (config.courseModuleCreated) {
    var modules = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'local_additional_web_service_created_module',
            'name':faker.company.name(),
            'description':faker.company.buzzPhrase,
            'courseid':39,
            'typeModule':'assign'
        }
    })
    console.log(modules.data)
}

if(config.courseModuleUpdated){
    var moduleUpdated = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_course_edit_module',
            'action':'hide',
            'id':31
        }
    })
    console.log(moduleUpdated.data);
}

if (config.courseModuleDeleted) {
    var courses = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_course_get_courses'
        }
    })
    courses.data.forEach(async(element) => {
        var getAllCourseModules = await axios("",{
            params:{
                'moodlewsrestformat':'json',
                'wstoken':process.env.TOKEN,
                'wsfunction':'core_course_get_courses'
            }
        })
    });
    var deletedCourseModule = await axios("http://10.8.0.11/moodle/webservice/rest/server.php",{
        params:{
            'moodlewsrestformat':'json',
            'wstoken':process.env.TOKEN,
            'wsfunction':'core_course_delete_modules',
            'cmids':[]
        }
    })
    console.log(deletedCourseModule.data);
}