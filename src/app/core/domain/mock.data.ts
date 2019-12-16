export const mock_data = {
    'app': {
        'name': 'Alain',
        'description': 'Ng-zorro admin panel front-end framework'
    },
    'user': {
        'name': 'Admin',
        'avatar': './assets/_/img/avatar.jpg',
        'email': 'zhangxuan@int-yt.com',
        'username': 'test'
    },
    'acltype': {
        'full': true,
        'roles': [],
        'abilities': []
    } ,
    'menu': [{
        'text': '主导航',
        'i18n': 'main_navigation',
        'group': true,
        'hideInBreadcrumb': true,
        'children': [{
            'text': '仪表盘',
            'i18n': 'dashboard',
            'icon': 'icon-speedometer',
            'children': [{
                'text': '仪表盘V1',
                'link': '/app/dashboard/v1',
                'i18n': 'dashboard_v1'
            }, {
                'text': '分析页',
                'link': '/app/dashboard/analysis',
                'i18n': 'dashboard_analysis'
            }, {
                'text': 'Monitor',
                'link': '/app/dashboard/monitor',
                'i18n': 'dashboard_monitor'
            }, {
                'text': 'Workplace',
                'link': '/app/dashboard/workplace',
                'i18n': 'dashboard_workplace'
            }]
        }, {
            'text': '快捷菜单',
            'i18n': 'shortcut',
            'icon': 'icon-rocket',
            'shortcut_root': true,
            'children': []
        }, {
            'text': '小部件',
            'i18n': 'widgets',
            'link': '/app/widgets',
            'icon': 'icon-grid',
            'badge': 2
        }]
    }, {
        'text': 'F-UI',
        'group': true,
        'hideInBreadcrumb': true,
        'children': [{
            'text': '样式',
            'i18n': 'style',
            'icon': 'icon-chemistry',
            'children': [{
                'text': 'Typography',
                'link': '/app/style/typography',
                'i18n': 'typography',
                'shortcut': true
            }, {
                'text': 'Grid Masonry',
                'link': '/app/style/gridmasonry',
                'i18n': 'gridmasonry'
            }, {
                'text': 'Font Icons',
                'link': '/app/style/iconsfont',
                'i18n': 'iconsfont'
            }, {
                'text': 'Colors',
                'link': '/app/style/colors',
                'i18n': 'colors'
            }]
        }, {
            'text': '@fui',
            'i18n': 'delon',
            'icon': 'icon-magic-wand',
            'children': [{
                'text': 'Dynamic Form',
                'link': '/app/fui/form',
                'i18n': 'dynamic-form'
            }, {
                'text': 'Simple Table',
                'link': '/app/fui/simple-table',
                'i18n': 'simple-table'
            },
            {
              'text': 'Util',
              'link': '/app/fui/util',
              'i18n': 'util',
              'acl': 'role-a'
            },
            {
                'text': 'Clipboard',
                'link': '/app/fui/clipboard',
                'i18n': 'clipboard',
                'acl': 'role-a'
            }, {
                'text': 'Print',
                'link': '/app/fui/print',
                'i18n': 'print',
                'acl': 'role-b'
            }, {
                'text': 'ACL',
                'link': '/app/fui/acl',
                'i18n': 'acl'
            },
            {
              'text': 'QR',
              'link': '/app/fui/qr',
              'i18n': 'qr'
            },
            {
                'text': 'Route Guard',
                'link': '/app/fui/guard',
                'i18n': 'guard'
            },
            {
                'text': 'Cache',
                'link': '/app/fui/cache',
                'i18n': 'cache'
            },
            {
                'text': 'Down File',
                'link': '/app/fui/downfile',
                'i18n': 'downfile'
            },
            {
                'text': 'Xlsx',
                'link': '/app/fui/xlsx',
                'i18n': 'xlsx'
            },
            {
                'text': 'Zip',
                'link': '/app/fui/zip',
                'i18n': 'zip'
            }]
        }]
    }, {
        'text': 'FUI Pro',
        'i18n': 'pro',
        'group': true,
        'hideInBreadcrumb': true,
        'children': [{
            'text': 'Form Page',
            'i18n': 'form',
            'link': '/app/pro/form',
            'icon': 'icon-note',
            'hideInBreadcrumb': true,
            'children': [{
                'text': 'Basic Form',
                'link': '/app/pro/form/basic-form',
                'i18n': 'basic-form',
                'shortcut': true
            }, {
                'text': 'Step Form',
                'link': '/app/pro/form/step-form',
                'i18n': 'step-form'
            }, {
                'text': 'Advanced Form',
                'link': '/app/pro/form/advanced-form',
                'i18n': 'advanced-form'
            }]
        }, {
            'text': 'List',
            'i18n': 'pro-list',
            'icon': 'icon-grid',
            'hideInBreadcrumb': true,
            'children': [{
                'text': 'Table List',
                'link': '/app/pro/list/table-list',
                'i18n': 'pro-table-list',
                'shortcut': true
            }, {
                'text': 'Basic List',
                'link': '/app/pro/list/basic-list',
                'i18n': 'pro-basic-list'
            }, {
                'text': 'Card List',
                'link': '/app/pro/list/card-list',
                'i18n': 'pro-card-list'
            }, {
                'text': 'Search List',
                'i18n': 'pro-search',
                'children': [
                    {
                        'link': '/app/pro/list/articles',
                        'i18n': 'pro-search-article'
                    }, {
                        'link': '/app/pro/list/projects',
                        'i18n': 'pro-search-project',
                        'shortcut': true
                    }, {
                        'link': '/app/pro/list/applications',
                        'i18n': 'pro-search-app'
                    }
                ]
            }]
        }, {
            'text': 'Profile',
            'i18n': 'pro-profile',
            'icon': 'icon-book-open',
            'hideInBreadcrumb': true,
            'children': [{
                'text': 'Basic',
                'link': '/app/pro/profile/basic',
                'i18n': 'pro-profile-basic'
            }, {
                'text': 'Advanced',
                'link': '/app/pro/profile/advanced',
                'i18n': 'pro-profile-advanced',
                'shortcut': true
            }]
        }, {
            'text': 'Result',
            'i18n': 'pro-result',
            'icon': 'icon-check',
            'hideInBreadcrumb': true,
            'children': [{
                'text': 'Success',
                'link': '/app/pro/result/success',
                'i18n': 'pro-result-success'
            }, {
                'text': 'Fail',
                'link': '/app/pro/result/fail',
                'i18n': 'pro-result-fail'
            }]
        }, {
            'text': 'Exception',
            'i18n': 'pro-exception',
            'link': '/',
            'icon': 'icon-fire',
            'children': [{
                'text': '403',
                'link': '/app/exception/403',
                'reuse': false
            }, {
                'text': '404',
                'link': '/app/exception/404',
                'reuse': false
            }, {
                'text': '500',
                'link': '/app/exception/500',
                'reuse': false
            }]
        }, {
            'text': 'User',
            'i18n': 'pro-user',
            'icon': 'icon-user',
            'children': [{
                'text': 'login',
                'link': '/passport/login',
                'i18n': 'pro-login',
                'reuse': false
            }, {
                'text': 'register',
                'link': '/passport/register',
                'i18n': 'pro-register',
                'reuse': false
            }, {
                'text': 'register result',
                'link': '/passport/register-result',
                'i18n': 'pro-register-result',
                'reuse': false
            }]
        }]
    }, {
        'text': 'More',
        'i18n': 'more',
        'group': true,
        'hideInBreadcrumb': true,
        'children': [{
            'text': 'Report',
            'i18n': 'report',
            'icon': 'anticon anticon-cloud-o',
            'children': [{
                'text': 'Relation',
                'link': '/app/data-v/relation',
                'i18n': 'relation',
                'reuse': false
            }]
        }, {
            'text': 'Extras',
            'i18n': 'extras',
            'link': '/extras',
            'icon': 'icon-cup',
            'children': [{
                'text': 'Help Center',
                'link': '/app/extras/helpcenter',
                'i18n': 'helpcenter'
            }, {
                'text': 'Settings',
                'link': '/app/extras/settings',
                'i18n': 'settings'
            }, {
                'text': 'Poi',
                'link': '/app/extras/poi',
                'i18n': 'poi'
            }]
        },
        {
            'text': 'Business',
            'i18n': 'business',
            'group': true,
            'icon': 'icon-cup',
            'children': [{
                'text': 'topicdetection',
                'link': '/app/business/topicdetection',
                'i18n': 'topicdetection'
            }]
        }
      ]
    }]
};


