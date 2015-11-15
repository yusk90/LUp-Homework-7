(function(){
    'use strict';

    var documentBody = document.body,
        originalTable = document.querySelector('.t1'),
        originalTableRowsNodeList = originalTable.querySelectorAll('tr'),
        buttonsWrapper = document.createElement('div'),
        buttonElement = document.createElement('button'),
        buttons = {
            switchColumnsButton: 'Switch 2nd and 3rd columns',
            addColumnButton: 'Add 4th column',
            setCookieButton: 'Set cookie',
            showCommentsButton: 'Alert comments',
            sendDataButton: 'Send data',
            removeNegativeValuesButton: 'Remove negative values',
            removeNamedFieldButton: 'Remove named field'
        },
        buttonName,
        btn;

    for (buttonName in buttons) {
        if (buttons.hasOwnProperty(buttonName)) {
            btn = buttonElement.cloneNode();
            btn.textContent = buttons[buttonName];
            btn.id = buttonName;
            buttonsWrapper.appendChild(btn);
        }
    }

    documentBody.insertBefore(buttonsWrapper, originalTable);

    // Helper function for NodeList
    function forEachNodeList(nodeList, callback) {
        return Array.prototype.forEach.call(nodeList, callback);
    }

    function mapNodeList(nodeList, callback) {
        return Array.prototype.map.call(nodeList, callback);
    }

    function reduceValues(tableRowsNodeList) {
        var numberToReduce = getCookieValue('bbb');

        if (numberToReduce) {
            forEachNodeList(tableRowsNodeList, function(row) {
                forEachNodeList(row.children, function(elem) {
                    if (!isNaN(elem.textContent) && elem.tagName === 'TD') {
                        elem.textContent = (parseFloat(elem.textContent) - 
                            numberToReduce).toFixed(2);
                    }
                });
            });
        }
    }

    // Task 1
    function changeTableColumns() {
        var table = originalTable.cloneNode(true),
            tableRowsNodeList = table.querySelectorAll('tr');

        forEachNodeList(tableRowsNodeList, function(row) {
            var rowArray = mapNodeList(row.children, function(elem) {
                return elem.textContent;
            });

            forEachNodeList(row.children, function(elem) {
                if (elem === row.children[1]) {
                    elem.textContent = rowArray[2];
                } else if (elem === row.children[2]) {
                    elem.textContent = rowArray[1];
                }
            });
        });

        return table;
    }

    // Task 2
    function addTableColumn() {
        var table = originalTable.cloneNode(true),
            tableRowsNodeList = table.querySelectorAll('tr');

        forEachNodeList(tableRowsNodeList, function(row) {
            var th = document.createElement('th'),
                td = document.createElement('td');

            if (row === tableRowsNodeList[0]) {
                th.textContent = 4;
                row.appendChild(th);
            } else {
                td.innerHTML = (parseFloat(row.children[1].textContent) +
                                parseFloat(row.children[2].textContent))
                                .toFixed(2);
                row.appendChild(td);
            }       
        });

        return table;
    }

    function styleTable(table) {
        var tableCellsNodeList = table.querySelectorAll('th, td');

        table.className = 't2';
        //table.style.width = 300;
        table.width = 300;
        
        forEachNodeList(tableCellsNodeList, function(elem) {
            elem.className = 't2';
        });
    }

    function renderTable(table) {
        styleTable(table);
        documentBody.appendChild(table);
    }

    function getCookieValue(cookieName) {
        var cookiesArray = document.cookie.split('; '),
            cookieValue;

        cookiesArray.forEach(function(elem) {
            if (elem.search(cookieName) !== -1) {
                cookieValue = elem.replace(cookieName + '=', '');
            }
        });

        return !isNaN(cookieValue) ? parseFloat(cookieValue) : cookieValue;

    }

    // Task 3
    function setCookie() {
        document.cookie = 'bbb=43';
    }

    // Task 4
    function sendData() {
        var table = addTableColumn(),
            tableRowsNodeList = table.querySelectorAll('tr'),
            xhr = new XMLHttpRequest(),
            dataArray = [];

        forEachNodeList(tableRowsNodeList, function(row) {
            var key = row.children[0],
                value = row.children[3];

            if (parseFloat(value.textContent) > 5 && value.tagName !== 'TH') {
                dataArray.push(encodeURIComponent(key.textContent) + 
                    '=' + encodeURIComponent(value.textContent));
                //dataArray.push(key.textContent + '=' + value.textContent);
            }
        });

        xhr.open('GET', 'http://domain.com?' + dataArray.join('&'), true);
        //xhr.open('POST', 'http://domain.com', true);
        if (confirm('Send data: ' + dataArray.join('&') + '?')) {
            xhr.send();
            //xhr.send(dataArray.join('&'));
        }
    }

    // Task 5
    function newIframe() {
        var iframe = document.createElement('iframe');

        documentBody.appendChild(iframe);
        return iframe;
    }

    function removeNegativeValues() {
        var tables = document.getElementsByTagName('table'),
            editedTables = document.createDocumentFragment();

        forEachNodeList(tables, function(table) {
            var tbody;

            table = table.cloneNode(true);
            tbody = table.querySelector('tbody');

            forEachNodeList(tbody.children, function(tr) {
                if (tbody.children[0].children[2].textContent === '3' && 
                            parseFloat(tr.children[2].textContent) < 0) {
                    //tr.style.display = 'none';
                    tr.className = 'delete';
                } else if (tbody.children[0].children[1].textContent === '3' &&
                            parseFloat(tr.children[1].textContent) < 0) {
                    //tr.style.display = 'none';
                    tr.className = 'delete';
                }
            });

            forEachNodeList(table.querySelectorAll('.delete'), function(row) {
                row.remove();
            });

            if (tbody.children.length > 1) {
                editedTables.appendChild(table);
            }    
        });

        return editedTables;
    }

    function removeNamedRow(name) {
        var tables = document.getElementsByTagName('table'),
            editedTables = document.createDocumentFragment();

        forEachNodeList(tables, function(table) {
            var tbody;

            table = table.cloneNode(true);
            tbody = table.querySelector('tbody');

            forEachNodeList(tbody.children, function(tr) {
                if (tr.children[0].textContent === name) {
                    tr.className = 'delete';
                }
            });

            forEachNodeList(table.querySelectorAll('.delete'), function(row) {
                row.remove();
            });

            editedTables.appendChild(table);
        });

        return editedTables;
    }

    function renderIframe(editedTables) {
        var iframe = newIframe(),
            editedTablesClone = editedTables.cloneNode(true);

        iframe.addEventListener('load', function() {
            styleIframe(iframe);
            iframe.contentWindow.document.body.appendChild(editedTablesClone);
        }, false);
        styleIframe(iframe);
        iframe.contentWindow.document.body.appendChild(editedTables);
    }

    function styleIframe(iframe) {
        var styles = document.querySelector('style').cloneNode(true);

        iframe.setAttribute('style', 'display: block; border: 2px solid pink;');
        iframe.contentWindow.document.body.style.margin = 0;
        iframe.contentWindow.document.head.appendChild(styles);
    }


    // Task 7
    function showComments() {
        var comments = document.documentElement.innerHTML.match(/<!--.*-->/g);

        comments.forEach(function(elem) {
            alert(elem.replace('<!--', '')
                      .replace('-->', '')
                      .replace('js:', '')
                      .trim());
        });
    }

    reduceValues(originalTableRowsNodeList);

    buttonsWrapper.addEventListener('click', function(e) {
        switch (e.target.id) {
            case 'switchColumnsButton':
                renderTable(changeTableColumns());
                break;
            case 'addColumnButton':
                renderTable(addTableColumn());
                break;
            case 'setCookieButton':
                setCookie();
                break;
            case 'showCommentsButton':
                showComments();
                break;
            case 'sendDataButton':
                sendData();
                break;
            case 'removeNegativeValuesButton':
                renderIframe(removeNegativeValues());
                break;
            case 'removeNamedFieldButton':
                renderIframe(removeNamedRow('Petya'));
                break;
            default:
                break;
        }
    }, false);

})();

/*http://www.hyperorg.com/blogger/2010/08/01/beginner-to-beginner-when-a-javascript-program-only-works-in-a-debugger/
http://unixpapa.com/js/sleep.html
https://bugzilla.mozilla.org/show_bug.cgi?id=297685
https://forum.jquery.com/topic/dynamically-created-iframe-and-it-s-data-manipulation-issue-under-firefox
*/
