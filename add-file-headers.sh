#!/usr/bin/env bash

#
# Helper script to add headers to source files.
# Invoke without arguments to display usage.
#
# date:   2018-19-01
# author: Mat Hansen <mhansen@eclipsesource.com>
#

MODE="undefined"
HEADER_FILE=""
SRC_PATH="/dev/null"
INDENT=2 # two spaces 

declare -a EXT_LIST=(ts:c tsx:c)

function print_usage {
  show_status usage "$0 [all|git-dirty] [-h|--header=/path/to/header] [-p|--path=/path/to/src]"
  show_status usage "Example: $0 all --header=./LICENSE --path=/lib # Will add header from LICENSE file and it to all supported file types in /lib directory"
}

function show_status {
  case "$1" in
    error)
      echo -e "\e[1m\e[31m[ERROR]\e[0m $2"
    ;;
    usage|info|*)
      echo -e "\e[1m[$(echo $1 | awk '{print toupper($0)}')]\e[0m $2"
    ;;
  esac
}

function fail {
  show_status error "$1"
  exit 1
}

function fail_arg {
  show_status error "$1. Unable to continue."
  print_usage
  exit 1
}

function verify_args {

  if [ ! -d $SRC_PATH ]; then
    fail_arg "Invalid path"
  fi

  if [[ -z $HEADER_FILE ||  ! -f $HEADER_FILE ]]; then
    fail_arg "Header file not found"
  fi

}

function add_header {

  style=$1
  indent=$(printf ' %.0s' $(seq 0 $(($2-1))))
  header=$3
  file=$4
  
  tmp_header=.~$style-style.header.tmp

  case "$style" in
    c) # add c style /* ... */ header
      if [ ! -f $tmp_header ]; then 
        cat $header | sed -e 's/^\(.*\)/  \1/g; 1 s#^\(.*\)$#/*\n\1#; $ s#^\(.*\)$#\1\n*/#;' > $tmp_header
      fi
      # check whether the first 3 lines are the same
      if [ $(diff -q <(head -n 3 $tmp_header) <(head -n 3 $file) | grep differ | wc -l) -eq 1 ]; then
	cat $tmp_header > $file.new
	cat $file >> $file.new
	mv $file.new $file
      fi
    ;;
  
    *)
      show_status error "Unsupported header style '$1'"
      exit 1
  esac
  
}

while [ $# -gt 0 ]; do
  case "$1" in
    all|git-dirty)
      if [ $MODE == "undefined" ]; then
        MODE="${1}"
      else
        fail_arg "Mode can only specified once!"
      fi
    ;;
    -h=*|--header=*)
      HEADER_FILE="${1#*=}"
      ;;
    -p=*|--path=*)
      SRC_PATH="${1#*=}"
      ;;
    *)
      fail_arg "Invalid argument '$1'. Forgot the '=' sign or trailing spaces?"
      print_usage
      exit 1
  esac
  shift
done

verify_args

export -f add_header show_status

for pattern in "${EXT_LIST[@]}"
do
  ext=$(echo $pattern | cut -d":" -f1)
  style=$(echo $pattern | cut -d":" -f2)
  rm .~$style-style.header.tmp > /dev/null 

  show_status info "Searching for $ext files... (applying $style style headers)"  
  case "$MODE" in
    all)
      find $SRC_PATH -name "*.$ext" -exec bash -c 'add_header $0 $1 $2 "$3" $4' $style $INDENT $HEADER_FILE {} \;
    ;;
    git-dirty)
      for file in $(git ls-files --others --exclude-standard --modified $SRC_PATH/**/*.$ext); do
	add_header $style $INDENT $HEADER_FILE $file	
      done
    ;;
  esac

done

show_status info "Completed"
unset -f add_header show_status

exit 0
