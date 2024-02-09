# arch-unit-ts How to contribute

<!--- TOC --->

- [Get project](#get-project)
- [Run it](#run-it)
- [Submitting a pull request](#submitting-a-pull-request)
<!--- TOC --->

I tried as much as I could to stay close to the original ArchUnit code.
If something you would like is missing, check ArchUnit implementation and make a merge request.

## Get project

Go to the [arch-unit-ts](https://github.com/arch-unit-ts/arch-unit-ts) project and click on the "fork" button.
You can then clone your own fork of the project, and start working on it.

[Please read the GitHub forking documentation for more information](https://help.github.com/articles/fork-a-repo)

Using SSH:

```
git clone git@github.com:<YOUR_USERNAME>/arch-unit-ts.git
```

Using HTTPS:

```
git clone https://github.com/<YOUR_USERNAME>/arch-unit-ts.git
```

Then, go inside your fork and add upstream:

Using SSH:

```
git remote add upstream git@github.com:arch-unit-ts/arch-unit-ts.git
```

Using HTTPS:

```
git remote add upstream https://github.com/arch-unit-ts/arch-unit-ts.git
```

The result of remote should be:

```
$ git remote -v
origin	git@github.com:<YOUR_USERNAME>/arch-unit-ts.git (fetch)
origin	git@github.com:<YOUR_USERNAME>/arch-unit-ts.git (push)
upstream	git@github.com:arch-unit-ts/arch-unit-ts.git (fetch)
upstream	git@github.com:arch-unit-ts/arch-unit-ts.git (push)
```

You can edit your `.git/config`, and update this section:

```
[remote "upstream"]
	url = git@github.com:arch-unit-ts/arch-unit-ts.git
	fetch = +refs/heads/*:refs/remotes/upstream/*
	fetch = +refs/pull/*/head:refs/remotes/upstream/pr/*
```

With this change, you'll be able to use `git fetch upstream` and test all existing pull requests, using `git switch pr/<number>`.

## Run it

```
npm install
```

```
npm test
```

## [Submitting a Pull Request](https://opensource.guide/how-to-contribute/#opening-a-pull-request)

Before you submit your pull request consider the following guidelines:

- Search [GitHub](https://github.com/arch-unit-ts/arch-unit-ts) for an open or closed Pull Request that relates to your submission
- Refresh your project

  ```shell
  git switch main
  git fetch upstream
  git rebase upstream/main
  ```

- Make your changes in a new git branch

  ```shell
  git switch -c my-fix-branch
  ```

- Create your patch, **including appropriate test cases**.
- Launch all tests

- ```shell
  npm test
  ```

- Commit your changes using a descriptive commit message

  ```shell
  git commit -a
  ```

  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

- Push your branch to GitHub:

  ```shell
  git push -u origin my-fix-branch
  ```

- In GitHub, send a pull request to `arch-unit-ts/arch-unit-ts:main`.
- If we suggest changes then

  - Make the required updates.
  - Re-run the tests
  - Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git fetch upstream
    git rebase upstream/main -i
    git push -f origin my-fix-branch
    ```

That's it! Thank you for your contribution!
