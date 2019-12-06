import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { IssuesCreateCommentParams } from '@octokit/rest';
import * as Octokit from '@octokit/rest';

const httpTrigger: AzureFunction = async function(context: Context, req: HttpRequest): Promise<void> {
  const { body: payload } = req;
  context.log(payload);

  const repo = payload.repository.name;
  const owner = payload.repository.owner.login;
  const issue_number = payload.number;
  const user = payload.pull_request.user.login;
  const action = payload.action;

  let body = 'Nothing to see here';

  if (action === 'opened') {
    body = `From all of us on the Cloud Advocacy team at Microsoft, thank you @${user} for creating this pull request!\n\nHave a Happy Holiday season!`;
    // body = `Thank you @${user} for creating this issue!\n\nHave a Happy Holiday season!`;
    context.log(body);
    const comment: IssuesCreateCommentParams = {
      repo,
      owner,
      issue_number,
      body
    };
    await createIssueComment(comment);
  }

  context.res = {
    status: 200 /* Defaults to 200 */,
    body
  };
};

async function createIssueComment(comment: IssuesCreateCommentParams) {
  const auth = process.env.githubkey_25dos;
  const octokit = new Octokit({ auth });
  const response = await octokit.issues.createComment(comment);
  return response;
}

export default httpTrigger;
