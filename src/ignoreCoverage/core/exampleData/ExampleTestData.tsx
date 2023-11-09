export class ExampleTestData{
    static getDataClumpsDict(){
        return (
            {
                "report_version": "0.1.93",
                "report_timestamp": "2023-06-04T16:55:40.566Z",
                "target_language": "java",
                "detector": {
                    "name": "FireboltCasters/data-clumps",
                    "version": "0.1.87",
                    "options": {
                        "sharedFieldParametersMinimum": 3,
                        "sharedFieldParametersCheckIfAreSubtypes": false,
                        "subclassInheritsAllMembersFromSuperclass": false,
                        "sharedMethodParametersMinimum": 3,
                        "sharedMethodParametersHierarchyConsidered": false,
                        "analyseMethodsWithUnknownHierarchy": false
                    }
                },
                "report_summary": {
                    "amount_data_clumps": 2
                },
                "project_info": {
                    "project_name": "ExampleTestData",
                    "project_version": "unknown",
                    "project_commit": "unknown",
                    "additional": {}
                },
                "data_clumps": {
                    "Fields1.java-Fields1-Fields2-xys": {
                        "type": "data_clump",
                        "key": "Fields1.java-Fields1-Fields2-xys",
                        "from_file_path": "Fields1.java",
                        "from_class_or_interface_name": "Fields1",
                        "from_class_or_interface_key": "Fields1",
                        "from_method_name": null,
                        "from_method_key": null,
                        "to_file_path": "Fields2.java",
                        "to_class_or_interface_key": "Fields2",
                        "to_class_or_interface_name": "Fields1",
                        "to_method_key": null,
                        "to_method_name": null,
                        "data_clump_type": "field_data_clump",
                        "data_clump_data": {
                            "Fields1/memberParameter/x": {
                                "key": "Fields1/memberParameter/x",
                                "name": "x",
                                "type": "int",
                                "modifiers": [],
                                "to_variable": {
                                    "key": "Fields2/memberParameter/x",
                                    "name": "x",
                                    "type": "int",
                                    "modifiers": []
                                }
                            },
                            "Fields1/memberParameter/y": {
                                "key": "Fields1/memberParameter/y",
                                "name": "y",
                                "type": "int",
                                "modifiers": [],
                                "to_variable": {
                                    "key": "Fields2/memberParameter/y",
                                    "name": "y",
                                    "type": "int",
                                    "modifiers": []
                                }
                            },
                            "Fields1/memberParameter/s": {
                                "key": "Fields1/memberParameter/s",
                                "name": "s",
                                "type": "String",
                                "modifiers": [],
                                "to_variable": {
                                    "key": "Fields2/memberParameter/s",
                                    "name": "s",
                                    "type": "String",
                                    "modifiers": []
                                }
                            }
                        }
                    },
                    "Fields2.java-Fields2-Fields1-xys": {
                        "type": "data_clump",
                        "key": "Fields2.java-Fields2-Fields1-xys",
                        "from_file_path": "Fields2.java",
                        "from_class_or_interface_name": "Fields2",
                        "from_class_or_interface_key": "Fields2",
                        "from_method_name": null,
                        "from_method_key": null,
                        "to_file_path": "Fields1.java",
                        "to_class_or_interface_key": "Fields1",
                        "to_class_or_interface_name": "Fields2",
                        "to_method_key": null,
                        "to_method_name": null,
                        "data_clump_type": "field_data_clump",
                        "data_clump_data": {
                            "Fields2/memberParameter/x": {
                                "key": "Fields2/memberParameter/x",
                                "name": "x",
                                "type": "int",
                                "modifiers": [],
                                "to_variable": {
                                    "key": "Fields1/memberParameter/x",
                                    "name": "x",
                                    "type": "int",
                                    "modifiers": []
                                }
                            },
                            "Fields2/memberParameter/y": {
                                "key": "Fields2/memberParameter/y",
                                "name": "y",
                                "type": "int",
                                "modifiers": [],
                                "to_variable": {
                                    "key": "Fields1/memberParameter/y",
                                    "name": "y",
                                    "type": "int",
                                    "modifiers": []
                                }
                            },
                            "Fields2/memberParameter/s": {
                                "key": "Fields2/memberParameter/s",
                                "name": "s",
                                "type": "String",
                                "modifiers": [],
                                "to_variable": {
                                    "key": "Fields1/memberParameter/s",
                                    "name": "s",
                                    "type": "String",
                                    "modifiers": []
                                }
                            }
                        }
                    }
                }
            }

        )
    }
}
