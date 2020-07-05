# Story Actions

GitHub-Actions で StoryBook をビルドし、GitHub-Pages にデプロイします
ここではサンプルプロジェクトとしてStoryBook+React構成を使用しています

## 使い方

- yarn build-story コマンドで、StoryBook がビルドできる環境を整える  
  [出力例](https://sorakumo001.github.io/story-actions/)
- 以下ファイルをプロジェクトディレクトリに入れるとGitHub-Actionsを利用することができます

```.sh
[.github]
 └─ [workflows]
     │  story-create.yml ブランチpush時にGitHub-Pagesを生成
     │  story-delete.yml ブランチdelete時にGitHub-Pagesから該当内容を除去
     └─ [res]
          index.html     GitHubPages用インデックスページ
```

## 出力結果

gh-pages リポジトリに以下のような構造が作成されます

```.sh
[/]
 |  index.html
 └─ [stories]
     │  index.txt  ブランチ一覧(インデックスページ構築用)
     ├─ [ブランチ名]
     |    build-story出力結果
     ├─ [ブランチ名]
     |    build-story出力結果
     └─ [ブランチ名]
          build-story出力結果
```

## GitHub-Pages への適用

- Settings -> GitHub Pages -> Source から **gh-pages branch** を再選択してください
- 「Your site is ready to be published at https://ユーザ名.github.io/リポジトリ名/. 」という表示が出れば、設定完了です
- 逆に、ブランチが選択されていても、この表示が出ていない場合は適用されていません
- また、実際に更新内容が適用されるまで、遅いときは 10 分ぐらいかかるときがあります
- 気長に待ちましょう

## 使用している設定

### story-create.yml

StoryBookをビルドし、結果をgh-pagesブランチに出力します  
メインのブランチから引き継ぐものはないので、gitの履歴は独立する形になります  

```story-create.yml
name: Create StoryBook Page
on:
  push:
    branches-ignore: ["gh-pages"]
jobs:
  Create:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Cache node_modules
        id: cache
        uses: actions/cache@v1
        with:
          path: node_modules
          key: ${{ runner.OS }}-build-${{ hashFiles('yarn.lock') }}
          restore-keys: ${{ runner.OS }}-build-${{ env.cache-name }}
      - name: Install Dependencies
        if: steps.cache.outputs.cache-hit != 'true'
        run: yarn
      - name: build storybook
        run: yarn build-storybook
      - name: Create gh-pages
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
        run: |
          BRANCH=`echo $GITHUB_REF | sed 's/^refs\/heads\///' | sed -e 's/\//-/g'`
          git clone https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY} -b gh-pages __gh-pages__ || mkdir -p __gh-pages__/stories
          rm -rf __gh-pages__/stories/${BRANCH} || true
          mv storybook-static __gh-pages__/stories/${BRANCH}
          cp -f .github/workflows/res/index.html __gh-pages__
          cd __gh-pages__/stories
          ls -d */ | sed 's/\///g' > index.txt
      - name: Save gh-pages
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
        run: |
          BRANCH=`echo $GITHUB_REF | sed 's/^refs\/heads\///' | sed -e 's/\//-/g'`
          cd __gh-pages__
          if [ ! -d ./.git ]; then
            git init
            git checkout -b gh-pages
            git remote add origin https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/$GITHUB_REPOSITORY
          else
            git remote set-url origin https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/$GITHUB_REPOSITORY
          fi
          git config --global user.name $GITHUB_ACTOR
          git config --global user.email ${GITHUB_ACTOR}@git
          git add .
          git commit -m "$GITHUB_REF" || true
          git push origin gh-pages || true

```

### story-delete.yml

deleteイベントは削除されるブランチとは無関係に、masterに置いてある設定内容が利用されます  
そのためGITHUB_REFはmasterを指すことになるので注意が必要です  
また、ブランチはmasterになるのでbranches-ignoreで何かやろうとしても、期待通りの結果にはなりません  

```story-delete.yml
name: Delete StoryBook Page
on:
  delete:
jobs:
  Delete:
    runs-on: ubuntu-latest
    steps:
      - name: Delete gh-pages
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
        run: |
          BRANCH=`echo ${{github.event.ref}} | sed -e 's/\//-/g'`
          git clone https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY} -b gh-pages __gh-pages__ || exit 0
          rm -rf __gh-pages__/stories/${BRANCH} || exit 0
          cd __gh-pages__
          ls -d */ | sed 's/\///g' > stories/index.txt
          git config --global user.name $GITHUB_ACTOR
          git config --global user.email ${GITHUB_ACTOR}@git
          git add .
          git commit -m "${BRANCH}"
          git push origin gh-pages || true
```
