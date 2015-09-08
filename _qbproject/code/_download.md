# Releases

All our releases are hosted on [Bintray](https://bintray.com/qb). The most recent version of qb is 0.4 Beta 1 for Scala 2.10.

## 0.4 version

To use the 0.4 Beta 1 version of qb, enter the following into your ```build.sbt```:

    resolvers += "QB repository" at "http://dl.bintray.com/qb/maven"

    libraryDependencies ++= Seq(
       "org.qbproject"     %% "qbschema" % "0.4.0-b1",
       "org.qbproject"     %% "qbplay"   % "0.4.0-b1",
       "org.reactivemongo" %% "play2-reactivemongo" % "0.10.2"
    )

# Build

We use [Travis CI](http://travis-ci.org/) to build qb:
[![Build Status](https://travis-ci.org/qb-project/qbproject.svg?branch=master)](http://travis-ci.org/qb-project/qbproject) [![Coverage Status](https://coveralls.io/repos/qb-project/qbproject/badge.png?branch=master)](https://coveralls.io/r/qb-project/qbproject?branch=master)    

# Source code

The source code of qb is available at [GitHub](https://github.com/qb-project/qbproject).
