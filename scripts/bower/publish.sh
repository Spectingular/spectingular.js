#!/usr/bin/env bash
if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    # Script for updating the Spectingular bower repos from current local build.

    echo $GIT_NAME

    echo "#################################"
    echo "#### Update bower ###############"
    echo "#################################"

    TMP_DIR=tmp
    BUILD_DIR=../../build
    SHA=$(git rev-parse --short HEAD)
    CURRENT_VERSION=$(echo $(sed -En 's/.*"'version'"[ ]*:[ ]*"(.*)".*/\1/p' bower.json));
    NEW_VERSION=$CURRENT_VERSION-build.$TRAVIS_BUILD_NUMBER+sha.$SHA


    # checkout the bower-spectingular repo
    rm -rf $TMP_DIR/bower-spectingular
    git clone https://github.com/Spectingular/bower-spectingular.git $TMP_DIR/bower-spectingular
    cd $TMP_DIR/bower-spectingular
    git config --global user.name "$GIT_NAME"
    git config --global user.email "$GIT_EMAIL"
    git config --global credential.helper "store --file=.git/credentials"
    echo "-- Storing credentials"
    echo "https://$GH_TOKEN:@github.com" > .git/credentials

    echo "-- Copying build files to bower-spectingular"
    cp ../../README.md .
    cp $BUILD_DIR/*.js .

    # updating bower.json
    sed -i '' -e 's/"*\(version\)"*[ ]*:[ ]*"*.*"*/"\1": "'$NEW_VERSION'"/' bower.json

    # adding all changed files
    git add -A

    echo "-- Committing and tagging bower-spectingular"
    git commit -m "v$NEW_VERSION"
    git tag v$NEW_VERSION

    echo "-- Pushing bower-spectingular"
    git push origin master
    git push origin v$NEW_VERSION
    rm .git/credentials
fi