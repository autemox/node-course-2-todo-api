var env = process.env.NODE_ENV || 'development';  // env can be 'deployment' (heroku"), 'test' (see package.json), or 'development'

console.log(`[config.js] Intiating.  Configured for ${env} environment`);

if(env == 'development' || env == 'test')
{
    // note production variables are passed in from heroku.  test and development come from config.json
    var config=require("./config.json");
    Object.keys(config[env]).forEach((key) => {   // load variables one at a time from config.json
        process.env[key]=config[env][key];        // aka process.env.PORT=config[env].PORT;
    });
}