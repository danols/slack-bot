import { SlackService } from "./component/SlackService";
import { Index } from "./component/Index";
import { MongoDataSource } from "./datasource/MongoDataSource";

let mongods = new MongoDataSource();

mongods.init(function(err) {
  if (err) {
    console.log("Error onConnect Mongo DB");
  } else {
    console.log("Mongo DB Connected");
    let githubService = new SlackService();
    let index = new Index();
  }
})