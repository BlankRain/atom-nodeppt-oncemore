'use babel';

import AtomNodepptOncemoreView from './atom-nodeppt-oncemore-view';
import { CompositeDisposable } from 'atom';
var ppt=require('./nodeppt');
export default {

  atomNodepptOncemoreView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomNodepptOncemoreView = new AtomNodepptOncemoreView(state.atomNodepptOncemoreViewState);
    this.modalPanel = atom.workspace.addBottomPanel({
      item: this.atomNodepptOncemoreView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-nodeppt-oncemore:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomNodepptOncemoreView.destroy();
  },

  serialize() {
    return {
      atomNodepptOncemoreViewState: this.atomNodepptOncemoreView.serialize()
    };
  },
  config: { port:{type:'integer',default:9527,title:'listen port',description:'local server listen port'}
    ,dir:{type:'string',default:'~/ppts',title:'ppt workspace',description:'dir for ppts'}
  },
  toggle() {
    console.log('AtomNodepptOncemore was toggled!');
    var d=atom.config.get('atom-nodeppt-oncemore.dir');
    d=d.replace('~',this.getUserHome());
    var pptConfig={port:atom.config.get('atom-nodeppt-oncemore.port')||9527,dir:d};
    if(this.modalPanel.isVisible()){
      ppt.stop();
    }else{
      ppt.start(pptConfig);
    }
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

  , getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

};
