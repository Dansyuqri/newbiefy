import * as github from '@actions/github'
import * as core from '@actions/core'

const githubToken = core.getInput('github-token')
const octokit = github.getOctokit(githubToken)

async function run() {
  const repoInfo = await octokit.context.repo
  const repoLanguages = await octokit.repos.listLanguages({
    ...repoInfo,
  })
  const latestCommit = await octokit.git.getCommit({
    ...repoInfo,
    commit_sha: github.context.sha,
  })
  const mainLanguage = Object.keys(repoLanguages).reduce(function(a, b) {
    return repoLanguages[a] > repoLanguages[b] ? a : b
  })

  const newBlob = await octokit.git.createBlob({
    ...repoInfo,
    content: mainLanguage,
  })
  const newTree = await octokit.git.createTree({
    ...repoInfo,
    tree: [
      {
        path: 'file.test',
        mode: '100644',
        type: 'blob',
        sha: newBlob.data.sha
      }
    ]
  })
  const newCommit = await octokit.git.createCommit({
    ...repoInfo,
    tree: newTree.data.sha,
    message: 'Newbiefied',
    parents: [latestCommit.data.sha]
  })

  await octokit.git.updateRef({
    ...repoInfo,
    ref: github.context.ref,
    sha: newCommit.data.sha
  })
}

run()
