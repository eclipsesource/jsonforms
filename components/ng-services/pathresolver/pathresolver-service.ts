///<reference path="../../references.ts"/>

import * as angular from 'angular'

import {PathResolver} from "../../services/pathresolver/jsonforms-pathresolver";

export default angular
    .module('jsonforms.pathresolver', [])
    .service('PathResolver', PathResolver).name;
