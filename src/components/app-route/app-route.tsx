import { Component, h ,Prop } from "@stencil/core";

@Component({
    tag: 'app-route'
})

export class AppRoute{
    @Prop() start: String;
    @Prop() destination: String;
    render(){
        return (
            <div>
                
            </div>
        )
    }
}