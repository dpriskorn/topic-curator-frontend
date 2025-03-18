# Wikidata Topic Curator
This a webapp to help wikimedians curate groups of items on Wikidata with topics.

## Yet another rewrite
This project contains a rewrite mostly done by chatbot. 
It has all the features of the former flask app except user defined prefix/affix.

Rewriting it had lots of benefits including:
* up to 100x faster page load time
* async in the browser is way nicer from the user prespective
* easier to maintain not that there is very little backend code at all
* I got to learn React :D 

## Features
See the documentation.
## Documentation
https://www.wikidata.org/wiki/Wikidata:Tools/Wikidata_Topic_Curator
## Participating
See the issues in Github. Feel free to open a new one or send a pull request. :)
## License
GPLv3+

## History
* 2025 React + Vite rewrite done (3 weeks development time using ChatGPT 4o to convert and improve existing code)
* 2024 [Python flask rewrite done](https://github.com/dpriskorn/WikidataTopicCurator) (months of development time)
* 2022 Python terminal app ItemSubjector (months of development time)

## Statistics
This is a 2k lines React app with 5 pages, 8 components and 10 models.

```
$ scc
───────────────────────────────────────────────────────────────────────────────
Language                 Files     Lines   Blanks  Comments     Code Complexity
───────────────────────────────────────────────────────────────────────────────
TypeScript                  41      2195      267       132     1796        202
```

## What I learned
* Chatgpt 4o is very good at React and TyepScript but I had to wrestle it a bit to get good OOP code
