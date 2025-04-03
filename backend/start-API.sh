#!/bin/bash

concurrently --raw  \
	"node --watch main.mjs" \
	"node --watch UserAPI/index.mjs "