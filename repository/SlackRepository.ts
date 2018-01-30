import Promise = require('bluebird')

interface SlackRepository 
{
  getUserInfo(): Promise;
  getUserRepos(): Promise;
  setIssue(nameRepo: string, title: string, body: string, assignee: string, milestone: number, labels: [string]): Promise;
  setWebHook(repo: string): Promise;
}

export { SlackRepository };