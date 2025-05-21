class AppConfig {

    public port = 4031;
    public mysqlHost = "localhost";
    public mysqlUser = "root";
    public mysqlPassword = "";
    public mysqlDatabase = "nike";
    public shoesImagesUsersUrl = `http://localhost:${this.port}/api/shoesUsers/images/`;

}

const appConfig = new AppConfig()

export default appConfig;