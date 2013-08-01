var ff;
(function (ff) {
    var LocalState = (function () {
        function LocalState() {
            this.orderID = -1;
            this.reachedGoal = true;
        }
        return LocalState;
    })();
    ff.LocalState = LocalState;
})(ff || (ff = {}));
