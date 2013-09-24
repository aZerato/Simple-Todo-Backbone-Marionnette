/*
 * Model
 */
var Todo = Backbone.Model.extend({
	/* defaults attributes values */
	defaults: {
		content: 'content',
		state: false
	}
});

/*
 * Collection
 */
var Todos = Backbone.Collection.extend({
	/* Type of collection */
	model: Todo,
	/* important to specify even if it's factice for manipulate the collection from differents views */
	url: 'todos.json'
});

/*
 * Application
 */
var TodoApp = new Backbone.Marionette.Application();

/*
 * Initializer
 */
TodoApp.addInitializer(function(options) {
	var primaryView = new PrimaryView({		
		collection: options.todos
	});

	var layout = new AppLayout();
	TodoApp.appRegion.show(layout);

	layout.mainRegion.show(primaryView);
});

TodoApp.addRegions({
	appRegion: '.todoApp'
});

var AppLayout = Backbone.Marionette.Layout.extend({
	template: '#layoutTemplate',
	regions: {
		mainRegion: '#main'
	}
});

var TodoItemView = Backbone.Marionette.ItemView.extend({
	template: '#itemTemplate',
	tagName: 'tr',

	events: {
		'keypress [data-bind=content]' : 'updateTodo',
		'click [data-bind=state]' : 'updateTodo',
		'click [data-bind=removeTodo]' : 'removeTodo'
	},

	updateTodo: function() {
		this.model.set('content', this.$el.find('[data-bind=content]').val());
		this.model.set('state', this.$el.find('[data-bind=state]').is(':checked') ? true : false);
	},

	removeTodo: function() {
		this.model.destroy();
	}
});

var PrimaryView = Backbone.Marionette.CompositeView.extend({
	template: '#primaryTemplate',
	itemView: TodoItemView,

	events: {
		'click [data-bind=addTodo]' : 'addTodo',
		'click [data-bind=saveTodos]' : 'saveTodos',
		'click [data-bind=loadTodos]' : 'loadTodos',
		'click [data-bind=clearTodos]' : 'clearTodos'
	},

	appendHtml: function(collectionView, itemView){
		collectionView.$("[data-collection=todos]").append(itemView.el);
	},

	addTodo: function() {
		var todo = new Todo({
			id: this.collection.length == 0 ? 1 : this.collection.last().get('id') + 1,
			content: "New todo"
		});
		this.collection.add(todo);
	},

	loadTodos: function() {
		var ltodos = localStorage.getItem("todos");
		if(ltodos == null) {
			alert('Nothing in the localStorage !');
			return;
		}
		this.collection.add(JSON.parse(ltodos));
		this.render();
	},

	saveTodos: function() {
		localStorage.setItem("todos", JSON.stringify(this.collection.toJSON()));
	},

	clearTodos: function() {
		localStorage.clear();
	}
});