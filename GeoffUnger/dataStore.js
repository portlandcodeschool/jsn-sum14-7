/**
 * Created with PhpStorm.
 * User: geoffreyunger
 * Date: 6/28/14
 * Time: 6:38 PM
 */

module.exports = function () {
    var data = [
        {id: 0, description: "JS homework", due: 1403989999, created: 1403989901},
        {id: 1, description: "Test subwoofers", due: 1403989999, created: 1403989901},
        {id:2, description: "Subaru oil change", due: 1403989999, created: 1403989901}
    ];
    var currentID = 3;
    this.addItem = function (description, dateDue) {
        var todo = {};
        dateDue = dateDue.split("/");
        dateDueObject = new Date(dateDue[2], dateDue[0], dateDue[1]);
        todo.created = Date.now();
        todo.due = Date.getTime(dateDueObject);
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
                dataStore.splice(deleteID, 1);
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
        var itemFound = false;
        data.map(function(item){
            if(item.id == id){
                itemFound = true;
                if(description){
                    item.description = description;
                }
                if(dateDue){
                    item.due = dateDue;
                }
            }
        })
        if(itemFound) return true;
        else return false;
    }
    this.getItem = function (id) {
        if(id){
            return data[id];
        }
        else{
            dataArray = [];
            data.forEach(function(item){
                dataArray.push(item);
            })
            return dataArray;
        }
    }
}
