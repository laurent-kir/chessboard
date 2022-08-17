(function() {
  'use strict';

  var $ = document.querySelector.bind(document);
  var $$ = document.querySelectorAll.bind(document);
  var toArray = function() { return Array.prototype.slice.call(arguments[0]); };

  var chess = (function() {
    var select = $('select');
    var board = $('#board');
    var target = $$('.cell')[Math.random() * 64 >> 0];

    return {
      __init__: function() {
        function paint(cells) {
          cells.forEach(function(cell) {
            cell.classList.add('possible');
          });
        }

        function clear() {
          target.classList.remove('selected');
          toArray($$('.possible')).forEach(function(cell) {
            cell.classList.remove('possible');
          });
        }

        function onChange() {
          board.setAttribute('data-select', select.value);
          target && target.click();
        }

        function onWheel(e) {
          var ind = (e.deltaY > 0 ? 1 : -1) + this.selectedIndex;

          if (this.options[ind]) {
            this.selectedIndex = ind;
            onChange();
          }
        }

        var onClick = (function(e) {
          var trg = e.target;

          if (!trg.classList.contains('cell')) return;

          target && clear();
          target = trg;
          target.classList.add('selected');
          this[select.value] && paint(this[select.value]());
        }).bind(this);

        select.addEventListener('change', onChange);
        select.addEventListener('wheel', onWheel);
        board.addEventListener('click', onClick);
        onChange();
      },
      rook: function() {
        var rowCells = toArray(target.parentNode.children);
        var ind = rowCells.indexOf(target);
        return toArray(board.children).map(function(row) {
          return row.children[ind];
        }).concat(rowCells);
      },
      knight: function(test) {
        var j = !test ? 3 : 0;
        var cb = j ? function() { return --j; } : function() { return j++ < 7; };
        var prev = target.parentNode;
        var next = prev;
        var ind = toArray(prev.children).indexOf(target);
        var cells = [];

        while (cb()) {
          next = next && next.nextElementSibling;
          prev = prev && prev.previousElementSibling;

          for (var i = 0; i < 2; i++) {
            var row = i ? next : prev;
            row && cells.push(row.children[ind - j], row.children[ind + j]);
          }
        }

        return cells.filter(Boolean);
      },
      bishop: function() {
        return this.knight(true);
      },
      king: function() {
        var parent = target.parentNode;
        var row = parent.previousElementSibling || parent;
        var ind = toArray(parent.children).indexOf(target) - 1;
        var j = (row === parent || !parent.nextElementSibling) ? 2 : 3;
        var cells = [];

        while (j--) {
          for (var i = 0; i < 3; i++) cells.push(row.children[ind + i]);
          row = row.nextElementSibling;
        }

        return cells.filter(Boolean);
      },
      queen: function() {
        return this.rook().concat(this.bishop());
      }
    };
  })();

  chess.__init__();
})();