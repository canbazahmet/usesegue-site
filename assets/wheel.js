(function(){
  var svg = document.getElementById('wheel');
  var ns = 'http://www.w3.org/2000/svg';
  var cx = 190, cy = 190;
  var outerR1 = 178, outerR2 = 128;
  var innerR1 = 124, innerR2 = 76;
  var n = 12;
  var highlightNum = 8;
  var accentHues = [188, 224, 320]; // teal, periwinkle, pink — sampled from the app icon

  function polar(r, deg){
    var rad = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }
  function ringSegmentPath(rOuter, rInner, startDeg, endDeg){
    var p1 = polar(rOuter, startDeg), p2 = polar(rOuter, endDeg);
    var p3 = polar(rInner, endDeg), p4 = polar(rInner, startDeg);
    var large = (endDeg - startDeg) > 180 ? 1 : 0;
    return ['M', p1[0], p1[1], 'A', rOuter, rOuter, 0, large, 1, p2[0], p2[1],
      'L', p3[0], p3[1], 'A', rInner, rInner, 0, large, 0, p4[0], p4[1], 'Z'].join(' ');
  }
  function isCompatible(num, letter){
    if (num === highlightNum && letter === 'B') return true;
    if (letter === 'A' && (num === highlightNum - 1 || num === highlightNum + 1)) return true;
    return false;
  }

  var frag = document.createDocumentFragment();
  for (var i = 0; i < n; i++){
    var num = i + 1;
    var startDeg = i * 30, endDeg = startDeg + 30;
    var hue = i * 30;

    [{letter:'B', r1: outerR1, r2: outerR2, light: 44},
     {letter:'A', r1: innerR1, r2: innerR2, light: 33}].forEach(function(ring){
      var isCurrent = (num === highlightNum && ring.letter === 'A');
      var compat = isCompatible(num, ring.letter);
      var path = document.createElementNS(ns, 'path');
      var fill = 'hsl(' + hue + ', 42%, ' + ring.light + '%)';
      if (isCurrent) fill = 'linear-gradient(90deg,#7fe6ec,#ea94d7)';
      path.setAttribute('d', ringSegmentPath(ring.r1, ring.r2, startDeg, endDeg));
      if (isCurrent){
        path.setAttribute('fill', 'url(#segueGrad)');
      } else {
        path.setAttribute('fill', fill);
      }
      path.setAttribute('stroke', '#100e1c');
      path.setAttribute('stroke-width', isCurrent ? 2.5 : 1.5);
      if (isCurrent) path.setAttribute('stroke', '#f1eefa');
      else if (compat) path.setAttribute('stroke', '#93a9f2');
      path.setAttribute('opacity', isCurrent || compat ? '1' : '0.5');
      frag.appendChild(path);

      var mid = startDeg + 15;
      var labelR = (ring.r1 + ring.r2) / 2;
      var pos = polar(labelR, mid);
      var text = document.createElementNS(ns, 'text');
      text.setAttribute('x', pos[0]); text.setAttribute('y', pos[1]);
      text.setAttribute('text-anchor', 'middle'); text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-family', "'IBM Plex Mono', monospace");
      text.setAttribute('font-size', '11.5');
      text.setAttribute('font-weight', isCurrent ? '700' : '500');
      text.setAttribute('fill', isCurrent ? '#12101f' : 'rgba(16,14,28,0.68)');
      text.textContent = num + ring.letter;
      frag.appendChild(text);
    });
  }

  var defs = document.createElementNS(ns, 'defs');
  var grad = document.createElementNS(ns, 'linearGradient');
  grad.setAttribute('id', 'segueGrad'); grad.setAttribute('x1', '0%'); grad.setAttribute('x2', '100%');
  [['0%','#7fe6ec'],['55%','#93a9f2'],['100%','#ea94d7']].forEach(function(s){
    var stop = document.createElementNS(ns, 'stop');
    stop.setAttribute('offset', s[0]); stop.setAttribute('stop-color', s[1]);
    grad.appendChild(stop);
  });
  defs.appendChild(grad);
  svg.appendChild(defs);
  svg.appendChild(frag);

  var center = document.createElementNS(ns, 'circle');
  center.setAttribute('cx', cx); center.setAttribute('cy', cy); center.setAttribute('r', 74);
  center.setAttribute('fill', '#171426'); center.setAttribute('stroke', '#332c4d');
  svg.appendChild(center);

  var t1 = document.createElementNS(ns, 'text');
  t1.setAttribute('x', cx); t1.setAttribute('y', cy - 6); t1.setAttribute('text-anchor', 'middle');
  t1.setAttribute('font-family', "'Sora', sans-serif"); t1.setAttribute('font-size', '22'); t1.setAttribute('font-weight', '700');
  t1.setAttribute('fill', '#f1eefa'); t1.textContent = '8A';
  svg.appendChild(t1);

  var t2 = document.createElementNS(ns, 'text');
  t2.setAttribute('x', cx); t2.setAttribute('y', cy + 16); t2.setAttribute('text-anchor', 'middle');
  t2.setAttribute('font-family', "'IBM Plex Mono', monospace"); t2.setAttribute('font-size', '11');
  t2.setAttribute('fill', '#9c94b8'); t2.setAttribute('id', 'wheelDeckLabel'); t2.textContent = 'ON DECK 1';
  svg.appendChild(t2);
})();
