// setTimeout(function(){

// }, 0);


// 导出内存 
// @address NativePointer类型
// @size:int型
function dumpMem(address, size) {
    var buf = Memory.readByteArray(address, size);
    console.log(hexdump(buf, {
      offset: 0,
      length: 64,
      header: true,
      ansi: true
    }));

    var fileName = '/sdcard/dump-memory-' + address.toString() + '.dll';
    var file = new File(fileName, 'wb');
    file.write(buf);
    file.flush();
    file.close();
}

Java.perform(function () {
  console.log('\njs begin');
    // var clazzv = Java.use('com.abc.efg');//要hook的类名完整路径
    /*clazzv.funcA.implementation = function(context) {
        var ret = this.FuncA(context);
        console.log('hahah hook java method ' + ret);
        return ret;
    }*/

    // hook native
    /*var nativePtr = Module.findExportByName('libxxoo.so', "Java_com_native_common.");
    Interceptor.attach(nativePtr , {
        onEnter: function(args) {
            console.log('args: ' + args[0]);
        }
        , onLeave: function(retval) {
            console.log('ret -> ' + retval);
        }
    });*/

    // dump all loaded modules 
    /*Process.enumerateModules({
        onMatch: function onMatch(module) {
            console.log('- ' + module.name + ', ' + module.base + ', ' + module.size + ', ' + module.path + ';');
                if (m.name == 'libmono.so') {
                    console.log('type: ' + m.type + ', name:' + m.name + 
                ', module:' + m.module + ', address:' + m.address + ', slot:' + m.slot);
                    return 'stop';
                }
        },
        onComplete: function onComplete() {
            console.log('- enumerate complete.')
            // send({ name: '+sync', from: "/process/modules", payload: { items: modules } });
            // callback();
        }
    });*/

    // var module = Process.findModuleByName('libmono.so');

    // console.log('momo: ' + Module.findBaseAddress('libmono.so'));

    // Module.enumerateExports('libmono.so', {
    //     onMatch: function (m) {
    //         // console.log('type: ' + m.type + ', name:' + m.name + 
    //         // ', module:' + m.module + ', address:' + m.address + ', slot:' + m.slot);
            
    //     },
    //     onComplete: function () {
    //         console.log('- exports complete.')
            // var file = new File('/sdcard/a12w.txt', 'wb');
            // file.write('haha abc');
            // file.flush();
            // file.close();
    //     }

    // });

    // hook ptrace 但好像没起作用
    /*
    var ptraceAddr =  Module.findExportByName("libc.so", "ptrace");
    console.log("ptrace: " + ptraceAddr);
    var ptrace = new NativeFunction(ptraceAddr, 'int', ['int', 'int', 'pointer', 'int']);
    Interceptor.replace(ptraceAddr, new NativeCallback(function( mode, pid, addr, data ) {
        console.log('ptrace pid ' + pid);
        var ret = ptrace(mode, pid, addr, data);
        console.log('ptrace ret ' + ret);
        return ret;
    }, 'int', ['int', 'int', 'pointer', 'int']));
    */

    // open 监控
    /*var openPtr = Module.findExportByName("libc.so", "open");
    var open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);
    Interceptor.replace(openPtr, new NativeCallback(function (pathPtr, flags) {
        var path = Memory.readUtf8String(pathPtr);
        var fd = open(pathPtr, flags);
        // if ( path.indexOf('.dll') != -1 ) {
        if (path.indexOf('cgroup') == -1 && path.indexOf('/proc/15658/stat') == -1
            && path.indexOf('/proc/net/xt_qtaguid/stats') == -1
            && path.indexOf('/proc/stat') == -1
            && path.indexOf('/dev/ashmem') == -1
             ) {
            console.log("Opening '" + path + "' with " + flags);
            console.log("Got fd: " + fd);

            console.log("\nBacktrace:\n" + 
                Thread.backtrace(this.context, Backtracer.ACCURATE)
                .map(DebugSymbol.fromAddress).join("\n"));
        } 
        return fd;
    }, 'int', ['pointer', 'int']));*/

    // 打印所有内存区域
    /*var memList = [];
    Process.enumerateRanges('rw-', {
        onMatch: function (range) {
            // console.log('--mem--: ' + JSON.stringify(range));
            memList.push(range);
        },
        onComplete: function (){}
    });

    // 搜索MZ,（DLL文件标识）
    memList.forEach(function(item){
        Memory.scan(ptr(item.base), item.size, '4d 5a 90 00', {
            onMatch: function (address, size){
                console.log('find at: ' + address + ' in range:' + JSON.stringify(item));
                dumpMem(item.base, item.size);
            },
            onError: function (reason) {
                // console.log('scan error ' + reason);
            },
            onComplete: function () {
                // console.log('scan complete');
            }
        });
    });*/
    

    // console.log(Process.platform + ' page size:' + Process.pageSize);


    // Interceptor.attach(openPtr, {
    //     onEnter: function (args) {
    //         var path = Memory.readUtf8String(args[0]);
    //         if (path.indexOf('cgroup') == -1 && path.indexOf('ashmem') == -1 && path.indexOf('dll') != -1) {
    //             this.islog = true;
    //             console.log("Opening '" + path + "' with " + args[1] + 
    //             // 'context  : ' + JSON.stringify(this.context) + "\n" +
    //             // 'Return   : ' + this.returnAddress + '\n' + 
    //             'ThreadId : ' + this.threadId + '\n' +
    //             'Depth    : ' + this.depth );
    //             console.log("Backtrace:\n" + 
    //             Thread.backtrace(this.context, Backtracer.ACCURATE)
    //             .map(DebugSymbol.fromAddress).join("\n"));
    //         }
    //     },
    //     onLeave: function (retval) {
            
    //         if (this.islog) {
    //             this.islog = false;
    //             var fd = retval.toInt32();
    //             console.log('fd       :' + fd + '\n');
    //         }

    //     }
    // });
       

       
    // 配置所有open函数
    /*
    var res = new ApiResolver("module");
    var open_addrs = [];
    var matches = res.enumerateMatchesSync('exports:*!open*');
    matches.forEach(function(target) {
        console.log('name: ' + target.name + ' addr: ' + target.address);
        console.log('addr type: ', + ccTypeof(target.address));
        if (!open_addrs.includes(target.address)) {
            open_addrs.push(target.address);
        }
    });

    open_addrs.forEach(function(item){
        Interceptor.attach(item, {

            onEnter: function(args) {
                var path = Memory.readUtf8String(args[0]);
                console.log('open - ' + path);

            },

            // onLeave: function(retval) {

            //     if (this.flag) {
            //         // print retval
            //         console.log("\nretval: " + retval);
            //         console.warn("\n*** exiting " + name);
            //     }
            // }

        });
    });
    */ 
});