#!/usr/bin/env bash
BASE_DIR=$PWD

function checkoutRepo() {
    REPO=$1
    TARGET_PATH=$2

    echo "-- Cloning $REPO TO $TARGET_PATH"
    rm -rf "$TARGET_PATH"
    git clone "$REPO" "$TARGET_PATH"
    pushd "$TARGET_PATH"
    git config --global user.name "$GIT_NAME"
    git config --global user.email "$GIT_EMAIL"
    git config --global credential.helper "store --file=.git/credentials"
    echo "-- Storing credentials"
    echo "https://$GH_TOKEN:@github.com" > .git/credentials
    popd
}


if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    # Script for updating the Spectingular bower repos from current local build.

    echo $GIT_NAME

    echo "#################################"
    echo "#### Update bower ###############"
    echo "#################################"

    TMP_DIR="$BASE_DIR/tmp"
    BUILD_DIR="$BASE_DIR/build"
    SHA=$(git rev-parse --short HEAD)
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    CURRENT_VERSION=$(echo $(sed -En 's/.*"'version'"[ ]*:[ ]*"(.*)".*/\1/p' bower.json));
    NEW_VERSION=$CURRENT_VERSION-build.$TRAVIS_BUILD_NUMBER+sha.$SHA


    # checkout the bower-spectingular repo
    echo "-- Checkout the bower-spectingular repo"

    checkoutRepo "https://github.com/Spectingular/bower-spectingular.git" "$TMP_DIR/bower-spectingular"

    pushd "$TMP_DIR/bower-spectingular"
    echo "-- Copying build files to bower-spectingular"
    cp $BUILD_DIR/*.js .

    # updating bower.json
    sed -i '' -e 's/"*\(version\)"*[ ]*:[ ]*"*.*"*/"\1": "'$NEW_VERSION'",/' bower.json

    # adding all changed files
    git add -A

    echo "-- Committing and tagging bower-spectingular"
    git commit -m "v$NEW_VERSION"
    git tag v$NEW_VERSION

    echo "-- Pushing bower-spectingular"
    git push origin $BRANCH
    git push origin v$NEW_VERSION
    rm .git/credentials
    popd

    # Checkout the spectingular-repo
    echo "-- Checkout the spectingular.js repo"

    PAGES_DIR="$TMP_DIR/spectingular.js.gh-pages"
    checkoutRepo "https://github.com/Spectingular/spectingular.js.git" "$PAGES_DIR"

    pushd "$PAGES_DIR"
    echo "-- Checking out gh-pages dir"
    git checkout gh-pages
    echo "-- Copying documentation files to gh-pages"
    rm -rf docs
    cp -r $BASE_DIR/docs .
    git add -A
    git commit -m "Docs for v$NEW_VERSION"
    git push
    popd
fi