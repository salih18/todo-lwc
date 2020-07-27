/**
 * ToDoManager class
 * Support Add/Remove/Update/Retrieve APIs
 */
public class ToDoController {
  //Add a new item in ToDo__c object
  //Accepts serialized ToDo object
  @AuraEnabled
  public static String addTodo(String payload) {
    ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);

    SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
    todo.put('Name', payloadObject.name);
    todo.put('Done__c', payloadObject.done);

    insert todo;

    ToDo newTodo = new ToDo();
    newTodo.id = todo.Id;
    newTodo.name = String.valueOf(todo.get('Name'));
    newTodo.todoDate = Date.valueOf(todo.get('CreatedDate'));
    newTodo.done = Boolean.valueOf(todo.get('Done__c'));

    return JSON.serialize(newTodo);
  }

  //Update an item
  //Accepts serialized ToDo object
  @AuraEnabled
  public static String updateTodo(String payload) {
    ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);

    SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
    todo.put('Id', payloadObject.id);
    todo.put('Name', payloadObject.name);
    todo.put('Done__c', payloadObject.done);

    update todo;
    return String.valueOf(todo.Id);
  }

  //Delete an item
  //Accepts id of the item to delete
  @AuraEnabled
  public static String deleteTodo(String todoId) {
    SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
    todo.put('Id', todoId);

    delete todo;
    return String.valueOf(todo.Id);
  }

  //Get all todos for last 7 days
  //The method is cacheable, means the response will cached in the browser
  @AuraEnabled(cacheable=true)
  public static List<ToDo> getAllTodos() {
    List<SObject> todos = Database.query(
      'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = LAST_N_DAYS:7 ORDER BY CreatedDate DESC'
    );

    return getToDos(todos);
  }

  //Get all todos for today
  @AuraEnabled
  public static List<ToDo> getCurrentTodos() {
    List<SObject> todos = Database.query(
      'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = TODAY ORDER BY CreatedDate DESC'
    );
    return getToDos(todos);
  }

  //Wrap ToDo__c SObject into ToDo object
  public static List<ToDo> getToDos(List<SObject> objs) {
    List<ToDo> todos = new List<ToDo>();
    for (SObject obj : objs) {
      ToDo todo = new ToDo();
      todo.id = obj.Id;
      todo.name = String.valueOf(obj.get('Name'));
      todo.todoDate = Date.valueOf(obj.get('CreatedDate'));
      todo.done = Boolean.valueOf(obj.get('Done__c'));
      todos.add(todo);
    }

    return todos;
  }

  //Wrapper Class to represent a ToDo Item
  public class ToDo {
    @AuraEnabled
    public String id;
    @AuraEnabled
    public String name;
    @AuraEnabled
    public Date todoDate;
    @AuraEnabled
    public Boolean done;
  }
}
