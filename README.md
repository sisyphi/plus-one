# PLUS ONE

## TODO'S

- [x] bug: can input 1 letter less for guesses
- [x] uiux: show used letters when typing a guess
- [x] refactor: move answer list to a component
- [x] uiux: show length of guess to compare to last answer
- [x] feat: move game logic to backend
- [x] perf: optimize validation
  - [x] create master graph for data
  - [x] create subgraph based on starting signature
  - [x] get starting word
  - [x] send starting word to create-subgraph
  - [x] send it to client
  - [x] use data for front end validation
- [x] feat: daily mode
  - [x] send timezone from client to server
  - [x] use timezone to get current datetime
  - [x] create idx using current datetime from origin datetime
  - [x] get word data using idx
  - [x] test if it works when reaching past midnight
  - [x] test if it works w/ different timezones
- [] game: refine starting word list to only use w/ a certain amount of nodes
  - [] generate a list of 4 letter signatures
  - [] get the graph info w/in the graph of each 4 letter

## Data sources

- (words_alpha)[https://github.com/dwyl/english-words]
- (top-english-wordlists)[https://github.com/david47k/top-english-wordlists?tab=readme-ov-file]
- (common-four-letter-words-en)[https://gist.github.com/collegeman/79bd777c6747c08237d0]
- (12dicts)[http://wordlist.aspell.net/12dicts-readme/]

## Copyright

Copyright 2000-2019 by Kevin Atkinson

Permission to use, copy, modify, distribute and sell these word
lists, the associated scripts, the output created from the scripts,
and its documentation for any purpose is hereby granted without fee,
provided that the above copyright notice appears in all copies and
that both that copyright notice and this permission notice appear in
supporting documentation. Kevin Atkinson makes no representations
about the suitability of this array for any purpose. It is provided
"as is" without express or implied warranty.

Copyright (c) J Ross Beresford 1993-1999. All Rights Reserved.

The following restriction is placed on the use of this publication:
if The UK Advanced Cryptics Dictionary is used in a software package
or redistributed in any form, the copyright notice must be
prominently displayed and the text of this document must be included
verbatim.

There are no other restrictions: I would like to see the list
distributed as widely as possible.
