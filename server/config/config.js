var env = process.env.NODE_ENV || 'development';  // env can be 'deployment' (heroku"), 'test' (see package.json), or 'development'

console.log(`Intiating.  Configured for ${env} environment`);

if(env == 'development') {
    process.env.PORT=3000;
    process.env.MONGODB_URI="mongodb://localhost/TodoApp";
} 
else if(env == 'test') {
    process.env.PORT=3001;
    process.env.MONGODB_URI="mongodb://localhost/TodoAppTest";
}