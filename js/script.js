$(document).ready(function () {
    var MODEL = {} || MODEL,
        VIEW = {} | VIEW,
        CONTROL = {} || CONTROL;

/*
 * MODEL
 */
    function Model() {
        if(!(this instanceof Model)) {
            return new Model();
        }
        this.started = "https://api.github.com/";
    }
    Model.prototype = {
        getGithubURL: function(username) {
            return this.started + "users/" + username + "/repos";
        }
    };

/*
 * CONTROL
 */
    function Control(model, view) {
        if(!(this instanceof Control)) {
            return new Control();
        }
        this.model = model;
        this.view = view;
    }
    Control.prototype = {
        createAllCards: function(username) {
            var that = this;
            $.ajax({
                dataType: 'json',
                url: this.model.getGithubURL(username),
                success: function createAll(data) {
                    that.view.createCards(data);
                }
            });
        }
    };



    function View(cardParent) {
        if(!(this instanceof View)) {
            return new View();
        }
        this.cardParent = cardParent;
    }
    View.prototype = {
        createOneCard: function(onePartData) {
            console.log('dodaje dla: ' + onePartData.owner.login);
            var htmlCard = '<div class="card"><div class="card-block"><a href="' + onePartData.url + '" target="_blank"><h4 class="card-title">' + onePartData.name + '</h4></a><h6 class="card-subtitle mb-2 text-muted">author: ' + onePartData.owner.login + '</h6><p class="card-text">' + onePartData.description + '</p></div></div>';
            return htmlCard;
        },
        createCards: function(json) {
            var that = this,
                tmp = '',
                maxCount = 3,
                len = parseInt(json.length) + 1;

            for(var i = 1; i < len; i++) {
                tmp += that.createOneCard(json[i - 1]);
                if(i % maxCount === 0) {
                    addGroup(tmp);
                    tmp = '';
                }
                else if(len - i < maxCount) {
                    if(i === len - 1) {
                        addGroup(tmp);
                    }
                }
            }

            function addGroup(content) {
                var str = '<div class="card-group">';
                str += content;
                str += '</div>';
                that.cardParent.append(str);
            }
        }
    };

//    LOGIC PART
    MODEL = new Model();
    VIEW = new View($('#card-parent'));
    CONTROL = new Control(MODEL, VIEW);
    CONTROL.createAllCards('SubtleSoftwareSolutions');
    CONTROL.createAllCards('roughtomato');
    CONTROL.createAllCards('ndv66');
});