<p align="center">
  <a href="https://dev.to" alt="dev.to">
    <img src="https://img.shields.io/badge/dev.to-hackathon-blue" />
  </a>
  <a href="https://github.com/Dansyuqri/newbiefy/actions?query=workflow%3Abuild-test" alt="workflow build-test">
    <img src="https://github.com/Dansyuqri/newbiefy/workflows/build-test/badge.svg" />
  </a>
  <a href="https://github.com/Dansyuqri/newbiefy/blob/main/LICENSE" alt="license">
    <img src="https://img.shields.io/badge/license-MIT-blue" />
  </a>
</p>

# Newbiefy
The Action you never knew you needed.

## What
Makes your repository beginner friendly by removing all source code and putting a hello world file (in the most used language of the repo) in its place.

## Why
Why not

## Usage
```yml
- uses: dansyuqri/newbiefy@latest
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Additional Info
Currently it supports the following languages:
- Java
- Python
- C
- C++
- C#
- Visual Basic .NET
- JavaScript
- PHP
- Objective-C
- SQL
- Ruby
- MATLAB

The codes have been referred from [this page](https://towardsdatascience.com/how-to-print-hello-world-in-top-12-most-popular-programming-languages-736d49c6c61c)

## Demo
Head over to [the test page](https://github.com/Dansyuqri/newbiefy-test) for a demo.
