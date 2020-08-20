const github = require('@actions/github');
const core = require('@actions/core');
const {CodeMap} = require('./codeMap');

const githubToken = core.getInput('github-token');
const octokit = github.getOctokit(githubToken);

async function run() {
  const repoInfo = github.context.repo;

  const latestCommit = await octokit.git.getCommit({
    ...repoInfo,
    commit_sha: github.context.sha,
  });
  const latestTree = await octokit.git.getTree({
    ...repoInfo,
    tree_sha: latestCommit.data.tree.sha,
    recursive: 1,
  });
  const mainLanguage = await getMainLangFromRepo(repoInfo);
  let codeMapObj = CodeMap[mainLanguage];
  if (codeMapObj === undefined) {
    core.debug('Language not found. Defaulting to .txt');
    codeMapObj = {
      extension: '.txt',
      content: 'SGVsbG8gV29ybGQh'
    };
  }

  const newbiefiedTree = await createNewbiefiedTree(repoInfo, codeMapObj, latestTree.data.tree);

  const newCommit = await octokit.git.createCommit({
    ...repoInfo,
    tree: newbiefiedTree.data.sha,
    message: 'Newbiefied',
    parents: [latestCommit.data.sha]
  });

  await octokit.git.updateRef({
    ...repoInfo,
    ref: github.context.ref.substr(5),
    sha: newCommit.data.sha
  });
}

async function createNewbiefiedTree(repoInfo, codeMapObj, latestTree) {
  const keptFiles = [];

  const newBlob = await octokit.git.createBlob({
    ...repoInfo,
    content: codeMapObj.content,
    encoding: 'base64'
  });
  latestTree.forEach(element => {
    if (element.type == 'tree' && element.path == '.github') {
      keptFiles.push(element)
    }
  });
  keptFiles.push({
    path: 'hello_world' + codeMapObj.extension,
    mode: '100644',
    type: 'blob',
    sha: newBlob.data.sha
  });
  const newTree = await octokit.git.createTree({
    ...repoInfo,
    tree: keptFiles
  });
  return newTree;
}

async function getMainLangFromRepo(repoInfo) {
  const repoLanguages = await octokit.repos.listLanguages({
    ...repoInfo,
  });

  return Object.keys(repoLanguages.data).reduce(function(a, b) {
    return repoLanguages[a] > repoLanguages[b] ? a : b
  });
}

run();
