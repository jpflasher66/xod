import R from 'ramda';
import { assert } from 'chai';

import * as XP from '../src';

import * as Helper from './helpers';

const constantPatches = {
  'xod/core/constant-boolean': {
    description: 'Constant value',
    links: {},
    nodes: {
      VAL: {
        boundValues: {},
        description: 'Constant value',
        id: 'VAL',
        label: 'VAL',
        position: {
          x: 0,
          y: 300,
        },
        type: 'xod/patch-nodes/output-boolean',
      },
      noNativeImpl: {
        boundValues: {},
        description: '',
        id: 'noNativeImpl',
        label: '',
        position: {
          x: 100,
          y: 100,
        },
        type: 'xod/patch-nodes/not-implemented-in-xod',
      },
    },
    path: 'xod/core/constant-boolean',
    impls: {
      cpp: 'struct State {\n};\n\n{{ GENERATED_CODE }}\n\nvoid evaluate(NodeId nid, State* state) {\n    reemitValue<Outputs::VAL>(nid);\n}\n',
      js: 'module.exports.setup = function(e) {\n  e.fire();\n};\n',
    },
  },
  'xod/core/constant-number': {
    description: '',
    links: {},
    nodes: {
      B1x2RV3eZ: {
        boundValues: {
          __in__: '',
        },
        description: '',
        id: 'B1x2RV3eZ',
        label: 'VAL',
        position: {
          x: 10,
          y: 120,
        },
        type: 'xod/patch-nodes/output-number',
      },
      H1PnRN2lW: {
        boundValues: {},
        description: '',
        id: 'H1PnRN2lW',
        label: '',
        position: {
          x: 10,
          y: 16,
        },
        type: 'xod/patch-nodes/not-implemented-in-xod',
      },
    },
    path: 'xod/core/constant-number',
    impls: {
      cpp: 'struct State {};\n\n{{ GENERATED_CODE }}\n\nvoid evaluate(NodeId nid, State* state) {\n  reemitValue<Outputs::VAL>(nid);\n}\n',
      js: 'module.exports.setup = function(e) {\n  e.fire();\n};\n',
    },
  },
  'xod/core/constant-string': {
    description: '',
    links: {},
    nodes: {
      B1x2RV3eZ: {
        boundValues: {
          __in__: '',
        },
        description: '',
        id: 'B1x2RV3eZ',
        label: 'VAL',
        position: {
          x: 10,
          y: 120,
        },
        type: 'xod/patch-nodes/output-string',
      },
      H1PnRN2lW: {
        boundValues: {},
        description: '',
        id: 'H1PnRN2lW',
        label: '',
        position: {
          x: 10,
          y: 16,
        },
        type: 'xod/patch-nodes/not-implemented-in-xod',
      },
    },
    path: 'xod/core/constant-string',
    impls: {
      cpp: 'struct State {};\n\n{{ GENERATED_CODE }}\n\nvoid evaluate(NodeId nid, State* state) {\n  reemitValue<Outputs::VAL>(nid);\n}\n',
    },
  },
  'xod/core/boot': {
    description: 'Outputs a single pulse when the program starts',
    links: {},
    nodes: {
      noNativeImpl: {
        boundValues: {},
        description: '',
        id: 'noNativeImpl',
        label: '',
        position: {
          x: 100,
          y: 100,
        },
        type: 'xod/patch-nodes/not-implemented-in-xod',
      },
      ryVmUAOrvkb: {
        boundValues: {
          __in__: false,
        },
        description: '',
        id: 'ryVmUAOrvkb',
        label: 'BOOT',
        position: {
          x: 10,
          y: 224,
        },
        type: 'xod/patch-nodes/output-pulse',
      },
    },
    path: 'xod/core/boot',
    impls: {
      cpp: 'struct State {\n};\n\n{{ GENERATED_CODE }}\n\nvoid evaluate(NodeId nid, State* state) {\n    emitValue<Outputs::BOOT>(nid, 1);\n}\n',
      js: 'module.exports.evaluate = function(e) {\n  e.fire({ BOOT: PULSE });\n};\n',
    },
  },
  'xod/core/continuously': {
    description: 'Continuously outputs pulses',
    links: {},
    nodes: {
      BLKANE3xW: {
        boundValues: {},
        description: '',
        id: 'BLKANE3xW',
        label: '',
        position: {
          x: 138,
          y: 120,
        },
        type: 'xod/patch-nodes/not-implemented-in-xod',
      },
      C0nt1n10Wl: {
        boundValues: {
          __in__: 'false',
        },
        description: 'Continuous pulses',
        id: 'C0nt1n10Wl',
        label: 'TICK',
        position: {
          x: 138,
          y: 224,
        },
        type: 'xod/patch-nodes/output-pulse',
      },
    },
    path: 'xod/core/continuously',
    impls: {
      cpp: 'struct State {\n};\n\n{{ GENERATED_CODE }}\n\nvoid evaluate(NodeId nid, State* state) {\n    emitValue<Outputs::TICK>(nid, 1);\n    setTimeout(nid, 0);\n}\n',
    },
  },
};

describe('extractBoundInputsToConstNodes', () => {
  const mainPatchPath = XP.getLocalPath('main');
  const testPatchPath = XP.getLocalPath('test');

  const getInputPinKey = type => `${type}-input`;

  const testPatch = Helper.defaultizePatch({
    nodes: {
      [getInputPinKey(XP.PIN_TYPE.PULSE)]: {
        type: XP.getTerminalPath(XP.PIN_DIRECTION.INPUT, XP.PIN_TYPE.PULSE),
      },
      [getInputPinKey(XP.PIN_TYPE.BOOLEAN)]: {
        type: XP.getTerminalPath(XP.PIN_DIRECTION.INPUT, XP.PIN_TYPE.BOOLEAN),
      },
      [getInputPinKey(XP.PIN_TYPE.STRING)]: {
        type: XP.getTerminalPath(XP.PIN_DIRECTION.INPUT, XP.PIN_TYPE.STRING),
      },
      [getInputPinKey(XP.PIN_TYPE.NUMBER)]: {
        type: XP.getTerminalPath(XP.PIN_DIRECTION.INPUT, XP.PIN_TYPE.NUMBER),
      },
      'some-output': {
        type: XP.getTerminalPath(XP.PIN_DIRECTION.OUTPUT, XP.PIN_TYPE.NUMBER),
      },
      'some-other-output': {
        type: XP.getTerminalPath(XP.PIN_DIRECTION.OUTPUT, XP.PIN_TYPE.STRING),
      },
    },
  });

  it('leaves nodes without bound input values unchanged', () => {
    const project = Helper.defaultizeProject({
      patches: R.merge(constantPatches, {
        [mainPatchPath]: {
          nodes: {
            'test-node': {
              type: testPatchPath,
              boundValues: {
                'some-output': 42,
              },
            },
          },
        },
        [testPatchPath]: testPatch,
      }),
    });

    assert.deepEqual(
      project,
      XP.extractBoundInputsToConstNodes(project, mainPatchPath, project)
    );
  });

  const testBoundPin = (
    dataType,
    boundValue,
    expectedConstNodeType,
    checkConstNodeBoundValue = true // TODO: this flag is a bit hacky
  ) =>
    it(`should extract bound '${dataType}' pin value '${boundValue}' to '${expectedConstNodeType}' node`, () => {
      const boundPinKey = getInputPinKey(dataType);
      const testNodeId = 'test-node';

      const project = Helper.defaultizeProject({
        patches: R.merge(constantPatches, {
          [mainPatchPath]: {
            nodes: {
              [testNodeId]: {
                type: testPatchPath,
                boundValues: {
                  [boundPinKey]: boundValue,
                },
              },
            },
          },
          [testPatchPath]: testPatch,
        }),
      });

      const transformedProject = XP.extractBoundInputsToConstNodes(project, mainPatchPath, project);

      const patch = XP.getPatchByPathUnsafe(mainPatchPath, transformedProject);

      const nodesByNodeType = R.compose(
        R.indexBy(XP.getNodeType),
        XP.listNodes
      )(patch);

      const testNode = nodesByNodeType[testPatchPath];
      assert.isTrue(
        XP.getBoundValue(boundPinKey, testNode).isNothing,
        `bound value for ${boundPinKey} must be deleted from test node`
      );

      const constantNode = nodesByNodeType[expectedConstNodeType];
      assert.isDefined(
        constantNode,
        `node of type '${expectedConstNodeType}' should be created`
      );

      const constantNodeOutputPinKey = R.compose(
        XP.getPinKey,
        R.head,
        XP.listOutputPins,
        XP.getPatchByPathUnsafe(R.__, transformedProject)
      )(expectedConstNodeType);

      const links = XP.listLinks(patch);
      assert.lengthOf(links, 1, 'a single link must be created');

      const link = R.head(links);
      assert.equal(
        XP.getLinkOutputNodeId(link),
        XP.getNodeId(constantNode),
        `link must be from ${expectedConstNodeType} node`
      );
      assert.equal(
        XP.getLinkOutputPinKey(link),
        constantNodeOutputPinKey,
        `link must be from ${expectedConstNodeType}'s output pin`
      );

      assert.equal(
        XP.getLinkInputNodeId(link),
        testNodeId,
        'link must be to test node'
      );
      assert.equal(
        XP.getLinkInputPinKey(link),
        boundPinKey,
        `link must be to test node's ${boundPinKey} pin`
      );

      if (checkConstNodeBoundValue) {
        const maybeBoundValue = XP.getBoundValue(constantNodeOutputPinKey, constantNode);
        assert(maybeBoundValue.isJust);
        assert.equal(
          maybeBoundValue.getOrElse(undefined),
          boundValue,
          `value from test node's pin must be bound to ${expectedConstNodeType}'s output`
        );
      }
    });

  testBoundPin(XP.PIN_TYPE.BOOLEAN, true, XP.getConstantPatchPath(XP.PIN_TYPE.BOOLEAN));
  testBoundPin(XP.PIN_TYPE.NUMBER, 42, XP.getConstantPatchPath(XP.PIN_TYPE.NUMBER));
  testBoundPin(XP.PIN_TYPE.STRING, 'hello', XP.getConstantPatchPath(XP.PIN_TYPE.STRING));

  testBoundPin(
    XP.PIN_TYPE.PULSE,
    XP.INPUT_PULSE_PIN_BINDING_OPTIONS.ON_BOOT,
    'xod/core/boot',
    false
  );
  testBoundPin(
    XP.PIN_TYPE.PULSE,
    XP.INPUT_PULSE_PIN_BINDING_OPTIONS.CONTINUOUSLY,
    'xod/core/continuously',
    false
  );

  it('discards any other values bound to pulse pins', () => {
    const dataType = XP.PIN_TYPE.PULSE;
    const boundValue = XP.INPUT_PULSE_PIN_BINDING_OPTIONS.NEVER;
    const boundPinKey = getInputPinKey(dataType);
    const testNodeId = 'test-node';

    const project = Helper.defaultizeProject({
      patches: R.merge(constantPatches, {
        [mainPatchPath]: {
          nodes: {
            [testNodeId]: {
              type: testPatchPath,
              boundValues: {
                [boundPinKey]: boundValue,
              },
            },
          },
        },
        [testPatchPath]: testPatch,
      }),
    });

    const transformedProject = XP.extractBoundInputsToConstNodes(project, mainPatchPath, project);

    const patch = XP.getPatchByPathUnsafe(mainPatchPath, transformedProject);

    const nodesByNodeType = R.compose(
      R.indexBy(XP.getNodeType),
      XP.listNodes
    )(patch);
    assert.lengthOf(R.values(nodesByNodeType), 1, 'no new nodes must be created');
    const testNode = nodesByNodeType[testPatchPath];

    assert.isTrue(
      XP.getBoundValue(boundPinKey, testNode).isNothing,
      `bound value for ${boundPinKey} must be deleted from test node`
    );

    const links = XP.listLinks(patch);
    assert.lengthOf(links, 0, 'no links must be created');
  });
});
