function ping(ip, callback) {

    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        var _that = this;
        this.img = new Image();
        this.img.onload = function () {
            _that.inUse = false;
            _that.callback('responded');

        };
        this.img.onerror = function (e) {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('responded', e);
            }

        };
        this.start = new Date().getTime();
        this.img.src = "http://" + ip;
        this.timer = setTimeout(function () {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout');
            }
        }, 1500);
    }
}
var PingModel = function (servers) {
    var self = this;
    var myServers = [];
	var index = 0;
	var label = "";
    ko.utils.arrayForEach(servers, function (location) {
		index++;
		switch (index) {
			case 1:
				label = "Authserver";
				break;
			case 2:
				label = "Mapserver";
				break;
			case 3:
				label = "Some other third server??";
				break;
			default:
				label = "ya messed it up";
				break;
		}
        myServers.push({
            name: location,
            status: ko.observable('unchecked'),
			display: label 
        });
    });
    self.servers = ko.observableArray(myServers);
    ko.utils.arrayForEach(self.servers(), function (s) {
        s.status('checking');
        new ping(s.name, function (status, e) {
            s.status(status);
        });
    });
};

var server1 = new PingModel(['localhost','127.0.0.1']);
ko.applyBindings(server1);