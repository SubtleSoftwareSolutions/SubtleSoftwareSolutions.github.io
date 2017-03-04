$(document).ready(function () {
    var MODEL = {} || MODEL,
        VIEW = {} | VIEW,
        CONTROL = {} || CONTROL;

    /**
     * Create Model object
     * @returns {scriptL#1.Model}
     */
    function Model() {
        if(!(this instanceof Model)) {
            return new Model();
        }
        this.started = 'https://api.github.com/';
    }
    Model.prototype = {
        getGithubURL: function(username) {
            return this.started + 'users/' + username + '/repos';
        }
    };

    /**
     * Create View object
     * @param {type} cardParent
     * @returns {scriptL#1.View}
     */
    function View(cardParent) {
        if(!(this instanceof View)) {
            return new View();
        }
        this.cardParent = cardParent;
    }
    View.prototype = {
        showError: function() {
            $('#api-error').removeClass('hidden-xs-up');
        },
        createOneCard: function(onePartData) {
            var htmlCard = '<div class="card"><div class="card-block"><a href="' + onePartData.html_url + '" target="_blank"><h4 class="card-title">' + onePartData.name + '</h4></a><p class="card-text">' + onePartData.description + '</p></div></div>';
            return htmlCard;
        },
        createCards: function(json) {
            var that = this,
                tmp = '',
                maxCount = 3,
                result = '',
                len = parseInt(json.length) + 1;

            for(var i = 1; i < len; i++) {
                tmp += that.createOneCard(json[i - 1]);
                if(i % maxCount === 0) {
                    result += createGroup(tmp);
                    tmp = '';
                }
                else if(len - i < maxCount) {
                    if(i === len - 1) {
                        result += createGroup(tmp);
                    }
                }
            }
            (function bindCardsToHTML(author) {
                var str = '<h5 class="author text-white">' + author + '</h5>' + result;
                that.cardParent.append(str);
            })(json[0].owner.login);

            function createGroup(content) {
                var str = '<div class="card-group">';
                str += content;
                str += '</div>';
                return str;
            }
        }
    };

    /**
     * Create Control object
     * @param {type} model
     * @param {type} view
     * @returns {scriptL#1.Control}
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
                },
                error: function error(request, status, error) {
                    that.view.showError();
                }
            });
        }
    };

//    LOGIC PART
    (function main() {
        MODEL = new Model();
        VIEW = new View($('#card-parent'));
        CONTROL = new Control(MODEL, VIEW);
        CONTROL.createAllCards('SubtleSoftwareSolutions');
        CONTROL.createAllCards('roughtomato');
        CONTROL.createAllCards('ndv66');
    })();
});