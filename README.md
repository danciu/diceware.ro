# diceware.ro
Diceware in Romanian, script(s) and list(s).

- [Lists](#lists)
- [Creating your own list](#creating-your-own-list)
- [Helpers](#helpers)

# Lists
You can find all the Romanian Diceware lists in the `/lists/` folder.

## 1. ASCII (no diacritics), 3 to 7 letter words (v2)
> Updated on 09/09/2019 (first published on 07/09/2019)

- [TXT format](https://github.com/danciu/diceware.ro/blob/master/lists/diceware-ro-ascii-7.txt)
- [PDF format](https://github.com/danciu/diceware.ro/blob/master/lists/diceware-ro-ascii-7.pdf)

## 2. ASCII, 3 to 6 letter words (v1)
> First published on 09/09/2019

- [TXT format](https://github.com/danciu/diceware.ro/blob/master/lists/diceware-ro-ascii-6.txt)
- [PDF format](https://github.com/danciu/diceware.ro/blob/master/lists/diceware-ro-ascii-6.pdf)

## 3. UTF8 (*only* words with diacritics), 3 to 7 letter words
> First published on 09/09/2019

- [TXT format](https://github.com/danciu/diceware.ro/blob/master/lists/diceware-ro-utf8-7.txt)
- [PDF format](https://github.com/danciu/diceware.ro/blob/master/lists/diceware-ro-utf8-7.pdf)

---

> :warning:

> Letters with diacritics are interpreted as the ones without, hence there is no particular order between them.

> Per example, words starting with 's' are mingled with the ones starting with 'ș' - ordering depends on all the other letters in the word.

---

## 4. UTF8 (*mixed* words, with and without diacritics), 3 to 6 letter words
TBA - in progress

# Creating your own list

### 1. Edit the `gwm-node.js` script as needed, then run the script:

```javascript
node gwm-node.js
```

This will compile the Diceware script (dictionary words + Diceware Kit).

### 2. Trim the generated list as needed

Automatic trimming happens by modifying the constants in the `gwm-node.js`, after which you need to manually trim the file:

#### a. The easy way

`(TOTAL_NUMBER_OF_LINES - 7776) / 26`

Some letters, per example k, q, x etc. have very few entries, so usually you would have to remove more from the ones with a lot of words and very few, or none, from the other ones.

#### b. The hard way

Express judgement as to what is appropriate by cherry-picking the words to delete (e.g. ambiguous and offensive words - although both criteria are very subjective).

### 3. Add the dice numbers and create the final list

Use an app like Excel or Numbers to paste the dice numbers in one column, and the words list in the other.
Use the dice numbers available [here](https://github.com/danciu/diceware.ro/blob/master/helpers/dice-numbers-7776.txt).

# Helpers

### Dice numbers, 11111 to 66666
Available [here](https://github.com/danciu/diceware.ro/blob/master/helpers/dice-numbers-7776.txt).