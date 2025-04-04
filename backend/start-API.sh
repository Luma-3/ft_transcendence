#!/bin/bash

concurrently --raw  \
	"node --watch main.mjs" \
	"cd UserAPI && node --watch index.mjs && cd .."