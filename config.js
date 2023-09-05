import { fa } from "@faker-js/faker";

export default {
    createUser:false,
    updatedUser:false,
    deletedUser:false,
    createCourse:false,
    courseUpdated:false,
    deleteCourse:false,
    userEnrolmentCreated:false,
    userEnrolmentUpdated:false,//no se puede generar porque es lo mismo que userenrolmentcreated
    userEnrolmentDeleted:false,
    roleUnassigned:false,//se ejecutan cuando se corre el enrollement y unenrollment
    roleAssigned:false,//se ejecutan cuando se corre el enrollement y unenrollment
    messageSent:false,
    messageViewed:false,
    messageDeleted:false,
    courseModuleCreated:false,
    courseModuleUpdated:false,
    //de aqui en adelante las que falta por sincronizar
    courseModuleDeleted:true,
    courseModuleCompletionUpdated:false
}