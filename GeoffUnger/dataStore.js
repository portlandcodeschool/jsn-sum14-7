/**
 * Created with PhpStorm.
 * User: geoffreyunger
 * Date: 6/28/14
 * Time: 6:38 PM
 */

module.exports = function () {
    var data = [];
    var currentID = 1;
    this.addItem = function (description, dateDue) {
        var todo = {};
        dateDue = dateDue.split("/");
        todo.due = new Date((dateDue[2]), dateDue[0] - 1, dateDue[1]);
        todo.created = Date.now();
        todo.description = description;
        todo.id = currentID;
        data.push(todo);
        currentID++;
        return todo;
    }
    this.deleteItem = function (id) {
        var itemFound = false;
        data.map(function (item, index) {
            if (item.id == id) {
                itemFound = true;
                data.splice(id - 1, 1);
            }
        });

        if (itemFound != true) {
            return false;
        }
        else {
            return true;
        }
    }
    this.updateItem = function (id, description, dateDue) {

        if (data[id]) {
            data[id].description = description;
            data[dateDue] = dateDue;
            return true;
        }
        else return false;
    }

    this.getItem = function (id) {
        if (id) {
            return data[id];
        }
        else {
            dataArray = [];
            data.forEach(function (item) {
                dataArray.push(item);
            })
            return dataArray;
        }
    }
}
