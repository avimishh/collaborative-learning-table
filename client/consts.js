// Pages
const relPathTeacher = "/views/Teacher";

export const URL = {
    HOME: '/',
    ADMIN: "/admin.html",
    CHILD:{
        HOME:"/views/Child/HomeScreen.html",
        DETAILS: '/views/Child/Details.html',
        PERFORMANCE: '/views/Child/Performance.html',
        SIGNIN: '/views/Child/SignIn.html',
        GAME: '/views/Child/gaming/gamingClient.html'
    },
    gaming:{
        GAMES_GALLERY: '/views/Child/gaming/gamesGallery.html'
    },
    PARENT:{
        HOME: '/views/Parent/HomeScreen.html',
        NOTES: '/views/Parent/notes.html',
        SIGNIN: '/views/Parent/SignIn.html',
        DETAILS: '/views/Parent/Details.html',
        REGISTER: '/views/Parent/Register.html',
    },
    TEACHER:{
        HOME: relPathTeacher + "/HomeScreen.html",
        NOTES: relPathTeacher + "/notes.html",
        SIGNIN: relPathTeacher + "/SignIn.html",
        DETAILS: relPathTeacher + "/Details.html",
        CHILD_MANAGEMENT:{
            HOME: relPathTeacher + "/childManagement/childManagement.html",
            REGISTER: relPathTeacher + "/childManagement/register.html",
            UPDATE: relPathTeacher + "/childManagement/update.html"
        }
    }
}