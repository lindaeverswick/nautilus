/**
 * ************************************
 *
 * @module  Links.tsx
 * @author
 * @date 3/23/20
 * @description Rendering of the nodes in d3 simulation
 *
 * ************************************
 */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
// IMPORT HELPER FUNCTIONS
import { SNode, Link, Services, ViewT } from '../App.d';
// IMPORT TYPES

type Props = {
  services: Services;
  // options: Options;
  view: ViewT;
};

const Links: React.FC<Props> = ({ services, view }) => {
  const {
    simulation,
    serviceGraph: { links },
  } = window;
  useEffect(() => {
    simulation.force(
      'link',
      d3
        .forceLink<SNode, Link>(links)
        .distance(130)
        .id((node: SNode) => node.name)
        .strength(0.01),
    );

    //initialize graph
    const arrowsGroup = d3
      .select('.graph')
      .append('svg:defs')
      .attr('class', 'arrowsGroup');

    arrowsGroup
      .selectAll('marker')
      .data(['end']) // Different link/path types can be defined here
      .enter()
      .append('svg:marker') // This section adds in the arrows
      .attr('id', String)
      .attr('class', 'arrowHead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 23)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    const linkGroup = d3.select('.links');

    const linkLines = linkGroup
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', 3)
      .attr('class', 'link')
      .attr('marker-end', 'url(#end)');

    linkGroup.lower();

    return () => {
      linkLines.remove();
      arrowsGroup.remove();
    };
  }, [services]);

  /**
   *********************
   * DEPENDS ON OPTION TOGGLE
   *********************
   */
  useEffect(() => {
    if (view === 'depends_on') {
      d3.select('.arrowsGroup').classed('hide', false);
      d3.select('.links').classed('hide', false);
    } else {
      d3.select('.arrowsGroup').classed('hide', true);
      d3.select('.links').classed('hide', true);
    }
  }, [view]);

  return <g className="links"></g>;
};

export default Links;
