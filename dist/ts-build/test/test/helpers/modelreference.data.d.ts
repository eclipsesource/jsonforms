export declare const testDataSchema: {
    'definitions': {
        'eClassifier': {
            'anyOf': {
                '$ref': string;
            }[];
        };
        'type': {
            'type': string;
            'properties': {
                'id': {
                    'type': string;
                    'minimum': number;
                };
            };
            'links': {
                'rel': string;
                'href': string;
                'targetSchema': {
                    $ref: string;
                };
            }[];
            'additionalProperties': boolean;
        };
        'enum': {
            'id': string;
            'type': string;
            'properties': {
                'eClass': {
                    'type': string;
                    'default': string;
                };
                '_id': {
                    'type': string;
                };
                'name': {
                    'type': string;
                };
                'instanceClassName': {
                    'type': string;
                };
                'instanceTypeName': {
                    'type': string;
                };
                'serializable': {
                    'type': string;
                };
                'eLiterals': {
                    'type': string;
                    'items': {
                        'type': string;
                    };
                };
            };
            'additionalProperties': boolean;
        };
        'datatype': {
            'id': string;
            'type': string;
            'properties': {
                'eClass': {
                    'type': string;
                    'default': string;
                };
                '_id': {
                    'type': string;
                };
                'name': {
                    'type': string;
                };
                'instanceClassName': {
                    'type': string;
                };
                'instanceTypeName': {
                    'type': string;
                };
            };
            'additionalProperties': boolean;
        };
        'eclass': {
            'type': string;
            'id': string;
            'properties': {
                'eClass': {
                    'type': string;
                    'default': string;
                };
                '_id': {
                    'type': string;
                };
                'name': {
                    'type': string;
                };
                'secondName': {
                    'type': string;
                };
                'instanceClassName': {
                    'type': string;
                };
                'instanceTypeName': {
                    'type': string;
                };
                'interface': {
                    'type': string;
                };
                'eStructuralFeatures': {
                    'type': string;
                    'items': {
                        'anyOf': {
                            '$ref': string;
                        }[];
                    };
                };
            };
            'additionalProperties': boolean;
        };
        'attribute': {
            'id': string;
            'type': string;
            'properties': {
                'eClass': {
                    'type': string;
                    'default': string;
                };
                '_id': {
                    'type': string;
                };
                'name': {
                    'type': string;
                };
                'containment': {
                    'type': string;
                };
                'eType': {
                    'type': string;
                    'properties': {
                        '$ref': {
                            'type': string;
                            'enum': string[];
                        };
                    };
                };
            };
            'additionalProperties': boolean;
        };
        'reference': {
            'id': string;
            'type': string;
            'properties': {
                'eClass': {
                    'type': string;
                    'default': string;
                };
                '_id': {
                    'type': string;
                };
                'name': {
                    'type': string;
                };
                'lowerBound': {
                    'type': string;
                };
                'upperBound': {
                    'type': string;
                };
                'many': {
                    'type': string;
                };
                'containment': {
                    'type': string;
                };
                'eOpposite': {
                    'type': string;
                    'properties': {
                        '$ref': {
                            'type': string;
                        };
                    };
                    'additionalProperties': boolean;
                };
                'eType': {
                    'type': string;
                };
            };
            'links': {
                'rel': string;
                'href': string;
                'targetSchema': {
                    $ref: string;
                };
            }[];
            'additionalProperties': boolean;
        };
    };
    'type': string;
    'id': string;
    'properties': {
        'eClass': {
            'type': string;
            'default': string;
        };
        '_id': {
            'type': string;
        };
        'name': {
            'type': string;
        };
        'nsURI': {
            'type': string;
        };
        'nsPrefix': {
            'type': string;
        };
        'eClassifiers': {
            'type': string;
            'items': {
                'anyOf': {
                    '$ref': string;
                }[];
            };
        };
    };
    'additionalProperties': boolean;
};
