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
