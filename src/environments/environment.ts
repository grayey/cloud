// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API_KEY: '',
  API_URL: {
    prefix: 'http://',
    body: 'cbcp.upltest.com',
    suffix: '/api/v1/',
    login: 'auth/login',
    ping: 'ping',
    programme: 'programme',
    schoolType: 'school-type',
    faculty: 'faculty',
    department: 'department',
    level: 'level',
    degree: 'degree',
    course_of_study: 'course-of-study',
    session: 'session',
    course: 'course-manager/course',
    curriculum: 'course-manager/curriculum',
    curriculum_course: 'course-manager/curriculum-course',
    permission: 'administration/permissions',
    active_hour: 'active-hour',
    profile: 'profile',
    filteredCourseOfStudy: 'course-of-study',
    hostel: 'hostel_management',
    student: 'student',
    room: 'room_management',
    bedspace: 'bed_space_management'
  },
  // DEFAULT_DOMAIN: 'college.portal'
  DEFAULT_DOMAIN: 'localhost',

};
